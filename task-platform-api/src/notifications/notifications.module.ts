import { Module } from '@nestjs/common';
import { NotificationsGateway } from './notifications.gateway';
import { BullModule } from '@nestjs/bull';
import { NotificationsProcessor } from './notifications.processor';

@Module({
  imports: [BullModule.registerQueue({ name: 'notifications' })],
  providers: [NotificationsGateway, NotificationsProcessor],
  exports: [NotificationsGateway],
})
export class NotificationsModule {}
