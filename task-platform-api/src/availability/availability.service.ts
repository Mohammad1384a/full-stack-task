import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserAvailability } from './availability.entity';
import { Repository } from 'typeorm';
import { User } from '../users/user.entity';
import { InjectRepository as InjectRepoTask } from '@nestjs/typeorm';
import { Task } from '../tasks/task.entity';

@Injectable()
export class AvailabilityService {
  constructor(
    @InjectRepository(UserAvailability)
    private repo: Repository<UserAvailability>,
    @InjectRepoTask(Task) private taskRepo: Repository<Task>,
  ) {}

  // recompute availability windows from tasks for a user
  async syncForUser(userId: string) {
    // delete old availability rows
    await this.repo.delete({ user: { id: userId } as User });
    // read current tasks
    const tasks = await this.taskRepo.find({
      where: { assignee: { id: userId } as any },
    });

    // write availability windows 1:1 with tasks
    // (in real life we could merge intervals; here we keep it simple)
    for (const t of tasks) {
      await this.repo.save(
        this.repo.create({
          user: { id: userId } as User,
          startDate: t.startDate,
          endDate: t.endDate,
        }),
      );
    }
  }
}
