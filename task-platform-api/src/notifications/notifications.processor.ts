import { Process, Processor } from '@nestjs/bull';
import type { Job } from 'bull';
import { NotificationsGateway } from './notifications.gateway';

@Processor('notifications')
export class NotificationsProcessor {
  constructor(private gateway: NotificationsGateway) {}

  @Process('taskCreated')
  async onTaskCreated(job: Job<{ userId: string; taskId: string }>) {
    this.gateway.notifyToUser(job.data.userId, 'task.created', job.data); // ⬅ only that user
  }

  @Process('taskReassigned')
  async onReassigned(job: Job<{ userId: string; taskId: string }>) {
    this.gateway.notifyToUser(job.data.userId, 'task.reassigned', job.data); // ⬅ only that user
  }
}
