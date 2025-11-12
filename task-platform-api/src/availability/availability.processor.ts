import { Process, Processor } from '@nestjs/bull';
import type { Job } from 'bull';
import { AvailabilityService } from './availability.service';

@Processor('availability')
export class AvailabilityProcessor {
  constructor(private readonly availability: AvailabilityService) {}

  @Process('sync')
  async handleSync(job: Job<{ userId: string }>) {
    // background recompute; if it fails, Bull will retry
    await this.availability.syncForUser(job.data.userId);
  }
}
