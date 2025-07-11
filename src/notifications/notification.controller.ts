// src/notification/notification.controller.ts
import { Controller, Post, Body } from '@nestjs/common';
import { NotificationsGateway } from './notifications.gateway';

@Controller('notifications')
export class NotificationController {
  constructor(private readonly notificationsGateway: NotificationsGateway) {}

  @Post()
  sendNotification(@Body('message') message: string) {
    this.notificationsGateway.sendNotification(message);
    return { success: true };
  }
}
