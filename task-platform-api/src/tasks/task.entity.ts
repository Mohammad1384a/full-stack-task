import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Index,
} from 'typeorm';
import { User } from '../users/user.entity';

export type TaskStatus = 'todo' | 'in_progress' | 'done' | 'blocked';

@Entity('tasks')
@Index(['title'], { fulltext: true }) // MySQL fulltext index for search (title)
@Index(['description'], { fulltext: true }) // ...and for description
@Index(['startDate', 'endDate']) // range queries
export class Task {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ type: 'text', nullable: true })
  description?: string | null;

  @Column({ type: 'datetime' })
  startDate: Date;

  @Column({ type: 'datetime' })
  endDate: Date;

  @Column({ type: 'varchar' })
  status: TaskStatus;

  @ManyToOne(() => User, (u) => u.tasks, { nullable: false, eager: true })
  assignee: User;
}
