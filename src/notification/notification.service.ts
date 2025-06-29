// src/notification/notification.service.ts
import { Injectable, Inject, Logger } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { MessagingPayload } from 'firebase-admin/lib/messaging/messaging-api';

@Injectable()
export class NotificationService {
    private readonly logger = new Logger(NotificationService.name);

    constructor(@Inject('FIREBASE_ADMIN') private readonly firebaseAdmin: admin.app.App) { }

    async sendPushNotification(deviceToken: string, title: string, body: string, data?: { [key: string]: string }): Promise<void> {
        const payload: MessagingPayload = {
            notification: {
                title,
                body,
            },
            data, // Gửi thêm dữ liệu tùy chọn
        };

        try {
            const response = await this.firebaseAdmin.messaging().send({
                token: deviceToken,
                ...payload
            });
            this.logger.log(`Successfully sent message: ${response}`);
        } catch (error) {
            this.logger.error('Error sending message:', error);
            // Xử lý lỗi, ví dụ: token không hợp lệ
        }
    }

    // Ví dụ gửi cho nhiều thiết bị
    async sendMulticastNotification(deviceTokens: string[], title: string, body: string, data?: { [key: string]: string }): Promise<void> {
        const payload: MessagingPayload = {
            notification: {
                title,
                body,
            },
            data,
        };

        try {
            const response = await this.firebaseAdmin.messaging().sendEachForMulticast({
                tokens: deviceTokens,
                ...payload
            });
            this.logger.log(`Successfully sent multicast message: ${response.successCount} successes, ${response.failureCount} failures`);

            if (response.failureCount > 0) {
                response.responses.forEach((resp, idx) => {
                    if (!resp.success) {
                        this.logger.error(`Failed to send to token ${deviceTokens[idx]}:`, resp.error);
                        // Bạn nên có logic xóa token không hợp lệ khỏi DB tại đây
                    }
                });
            }
        } catch (error) {
            this.logger.error('Error sending multicast message:', error);
        }
    }
}