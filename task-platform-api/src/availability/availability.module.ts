import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserAvailability } from './availability.entity';
import { AvailabilityService } from './availability.service';
import { BullModule } from '@nestjs/bull';
import { AvailabilityProcessor } from './availability.processor';
import { Task } from '../tasks/task.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserAvailability, Task]),
    BullModule.registerQueue({ name: 'availability' }),
  ],
  providers: [AvailabilityService, AvailabilityProcessor],
  exports: [AvailabilityService],
})
export class AvailabilityModule {}
