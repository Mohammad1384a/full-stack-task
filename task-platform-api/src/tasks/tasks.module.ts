import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { UsersModule } from '../users/users.module';
import { AvailabilityModule } from '../availability/availability.module';
import { BullModule } from '@nestjs/bull';

@Module({
  imports: [
    TypeOrmModule.forFeature([Task]),
    UsersModule,
    AvailabilityModule,
    BullModule.registerQueue({ name: 'availability' }), // background updates
    BullModule.registerQueue({ name: 'notifications' }), // notify assignees
  ],
  providers: [TasksService],
  controllers: [TasksController],
})
export class TasksModule {}
