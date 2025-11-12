import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Index,
} from 'typeorm';
import { Task } from '../tasks/task.entity';

export type UserRole = 'admin' | 'user';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index({ unique: true }) // fast login lookup
  @Column()
  email: string;

  @Column()
  name: string;

  @Column({ type: 'varchar', default: 'user' })
  role: UserRole; // 'admin' or 'user'

  @Column()
  passwordHash: string;

  @OneToMany(() => Task, (t) => t.assignee)
  tasks: Task[];
}
