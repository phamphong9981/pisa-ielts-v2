// src/notification/notification.controller.ts
import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { SendNotificationDto } from './dto/send-notification.dto';

@Controller('notifications')
export class NotificationController {
    constructor(private readonly notificationService: NotificationService) { }

    @Post('send')
    @HttpCode(HttpStatus.OK)
    async sendNotification(@Body() sendNotificationDto: SendNotificationDto) {
        const { token, title, body } = sendNotificationDto;
        await this.notificationService.sendPushNotification(token, title, body);
        return { message: 'Notification sent successfully' };
    }
}