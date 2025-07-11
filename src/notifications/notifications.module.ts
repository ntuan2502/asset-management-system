// src/notification/notification.module.ts
import { Module } from '@nestjs/common';
import { NotificationsGateway } from './notifications.gateway';
import { NotificationController } from './notification.controller';

@Module({
  controllers: [NotificationController],
  providers: [NotificationsGateway],
})
export class NotificationsModule {}
