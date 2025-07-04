import { Injectable, Inject } from '@nestjs/common';
import * as admin from 'firebase-admin';

export interface SendNotificationDto {
    title: string;
    body: string;
    data?: Record<string, string>;
    imageUrl?: string;
}

@Injectable()
export class FirebaseService {
    constructor(@Inject('FIREBASE_ADMIN') private readonly firebaseApp: admin.app.App) { }

    async sendNotificationToToken(
        fcmToken: string,
        notification: SendNotificationDto
    ): Promise<string> {
        if (!this.firebaseApp) {
            throw new Error('Firebase app is not initialized');
        }

        const message: admin.messaging.Message = {
            token: fcmToken,
            notification: {
                title: notification.title,
                body: notification.body,
                imageUrl: notification.imageUrl,
            },
            data: notification.data,
            android: {
                priority: 'high',
            },
            apns: {
                headers: {
                    'apns-priority': '10',
                },
            },
        };

        try {
            const response = await this.firebaseApp.messaging().send(message);
            return response;
        } catch (error) {
            throw new Error(`Failed to send notification: ${error.message}`);
        }
    }

    async sendNotificationToMultipleTokens(
        fcmTokens: string[],
        notification: SendNotificationDto
    ): Promise<admin.messaging.BatchResponse> {
        if (!this.firebaseApp) {
            throw new Error('Firebase app is not initialized');
        }

        if (fcmTokens.length === 0) {
            throw new Error('No FCM tokens provided');
        }

        const message: admin.messaging.MulticastMessage = {
            tokens: fcmTokens,
            notification: {
                title: notification.title,
                body: notification.body,
                imageUrl: notification.imageUrl,
            },
            data: notification.data,
            android: {
                priority: 'high',
            },
            apns: {
                headers: {
                    'apns-priority': '10',
                },
            },
        };

        try {
            const response = await this.firebaseApp.messaging().sendEachForMulticast(message);
            return response;
        } catch (error) {
            throw new Error(`Failed to send notifications: ${error.message}`);
        }
    }

    async sendNotificationToTopic(
        topic: string,
        notification: SendNotificationDto
    ): Promise<string> {
        if (!this.firebaseApp) {
            throw new Error('Firebase app is not initialized');
        }

        const message: admin.messaging.Message = {
            topic: topic,
            notification: {
                title: notification.title,
                body: notification.body,
                imageUrl: notification.imageUrl,
            },
            data: notification.data,
            android: {
                priority: 'high',
            },
            apns: {
                headers: {
                    'apns-priority': '10',
                },
            },
        };

        try {
            const response = await this.firebaseApp.messaging().send(message);
            return response;
        } catch (error) {
            throw new Error(`Failed to send notification to topic: ${error.message}`);
        }
    }

    async subscribeToTopic(fcmToken: string, topic: string): Promise<void> {
        if (!this.firebaseApp) {
            throw new Error('Firebase app is not initialized');
        }

        try {
            await this.firebaseApp.messaging().subscribeToTopic([fcmToken], topic);
        } catch (error) {
            throw new Error(`Failed to subscribe to topic: ${error.message}`);
        }
    }

    async unsubscribeFromTopic(fcmToken: string, topic: string): Promise<void> {
        if (!this.firebaseApp) {
            throw new Error('Firebase app is not initialized');
        }

        try {
            await this.firebaseApp.messaging().unsubscribeFromTopic([fcmToken], topic);
        } catch (error) {
            throw new Error(`Failed to unsubscribe from topic: ${error.message}`);
        }
    }
} 