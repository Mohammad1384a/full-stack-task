import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Repository, Not } from 'typeorm';
import { Task } from './task.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersService } from '../users/users.service';
import { InjectQueue } from '@nestjs/bull';
import type { Queue } from 'bull';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task) private repo: Repository<Task>,
    private users: UsersService,
    @InjectQueue('availability') private availabilityQ: Queue,
    @InjectQueue('notifications') private notificationsQ: Queue,
  ) {}

  async search(q?: string) {
    if (!q) return this.repo.find();
    // Simple FULLTEXT search (MySQL) on title/description
    return this.repo
      .createQueryBuilder('t')
      .where('MATCH(t.title) AGAINST (:q IN BOOLEAN MODE)', { q })
      .orWhere('MATCH(t.description) AGAINST (:q IN BOOLEAN MODE)', { q })
      .getMany();
  }

  async list() {
    return this.repo.find();
  }

  async ensureNoOverlap(
    userId: string,
    start: Date,
    end: Date,
    ignoreTaskId?: string,
  ) {
    const qb = this.repo
      .createQueryBuilder('t')
      .leftJoin('t.assignee', 'u')
      .where('u.id = :userId', { userId })
      .andWhere('t.startDate <= :end AND t.endDate >= :start', { start, end });

    if (ignoreTaskId) qb.andWhere('t.id != :ignoreTaskId', { ignoreTaskId });

    const conflict = await qb.getOne();
    if (conflict)
      throw new BadRequestException('User already has overlapping task');
  }

  async create(dto: any) {
    const user = await this.users.findById(dto.assigneeId);
    if (!user) throw new NotFoundException('Assignee not found');

    const start = new Date(dto.startDate);
    const end = new Date(dto.endDate);
    if (end < start)
      throw new BadRequestException('End date must be after start date');

    await this.ensureNoOverlap(user.id, start, end);

    const task = this.repo.create({
      ...dto,
      assignee: user,
      startDate: start,
      endDate: end,
    });
    const saved = await this.repo.save(task);

    // push availability recompute in background (fast return)
    await this.availabilityQ.add('sync', { userId: user.id });
    // push notification job (simulate)
    await this.notificationsQ.add('taskCreated', {
      userId: user.id,
      taskId: saved[0]?.id,
    });

    return saved;
  }

  async update(id: string, dto: any) {
    const task = await this.repo.findOne({ where: { id } });
    if (!task) throw new NotFoundException('Task not found');

    // handle optional reassignment
    if (dto.newAssigneeId) {
      const newUser = await this.users.findById(dto.newAssigneeId);
      if (!newUser) throw new NotFoundException('New assignee not found');

      const start = new Date(dto.startDate ?? task.startDate);
      const end = new Date(dto.endDate ?? task.endDate);
      await this.ensureNoOverlap(newUser.id, start, end, id);

      task.assignee = newUser;
      // notify reassignment
      await this.notificationsQ.add('taskReassigned', {
        userId: newUser.id,
        taskId: task.id,
      });
      await this.availabilityQ.add('sync', { userId: newUser.id });
      await this.availabilityQ.add('sync', {
        userId: (task.assignee as any).id,
      }); // old user cleanup
    }

    if (dto.title !== undefined) task.title = dto.title;
    if (dto.description !== undefined) task.description = dto.description;
    if (dto.status !== undefined) task.status = dto.status;
    if (dto.startDate) task.startDate = new Date(dto.startDate);
    if (dto.endDate) task.endDate = new Date(dto.endDate);

    // if dates changed, re-check overlap for current assignee
    if (dto.startDate || dto.endDate) {
      await this.ensureNoOverlap(
        task.assignee.id,
        task.startDate,
        task.endDate,
        id,
      );
      await this.availabilityQ.add('sync', { userId: task.assignee.id });
    }

    return this.repo.save(task);
  }

  async remove(id: string) {
    const task = await this.repo.findOne({ where: { id } });
    if (!task) return { ok: true };
    await this.repo.remove(task);
    // recalc availability for that user
    await this.availabilityQ.add('sync', { userId: task.assignee.id });
    return { ok: true };
  }

  async get(id: string) {
    const t = await this.repo.findOne({ where: { id } });
    if (!t) throw new NotFoundException('Task not found');
    return t;
  }
  async findByUser(userId: string, q?: string) {
    // simple search for this user's tasks only
    if (q && q.trim()) {
      // use QB so we can filter by assignee + full-text
      return this.repo
        .createQueryBuilder('t')
        .leftJoin('t.assignee', 'u')
        .where('u.id = :userId', { userId })
        .andWhere(
          '(MATCH(t.title) AGAINST (:q IN BOOLEAN MODE) OR MATCH(t.description) AGAINST (:q IN BOOLEAN MODE))',
          { q },
        )
        .orderBy('t.startDate', 'DESC')
        .getMany();
    }

    // no search: simple find by relation
    return this.repo.find({
      where: { assignee: { id: userId } as any },
      order: { startDate: 'DESC' },
    });
  }
}
