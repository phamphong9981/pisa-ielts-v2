import {
    Body,
    Controller,
    Post,
    Request,
    UseGuards,
    UseInterceptors,
    HttpException,
    HttpStatus,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { TransformInterceptor } from '../interceptors/transform.interceptor';
import { FirebaseService, SendNotificationDto } from './firebase.service';
import { UserService } from '../users/user.service';

export class SendNotificationToUserDto {
    username: string;
    title: string;
    body: string;
    data?: Record<string, string>;
    imageUrl?: string;
}

export class SendNotificationToTopicDto {
    topic: string;
    title: string;
    body: string;
    data?: Record<string, string>;
    imageUrl?: string;
}

@UseInterceptors(TransformInterceptor)
@Controller('firebase')
export class FirebaseController {
    constructor(
        private readonly firebaseService: FirebaseService,
        private readonly userService: UserService,
    ) { }

    @Post('send-notification')
    @UseGuards(JwtAuthGuard)
    async sendNotificationToUser(
        @Body() sendNotificationDto: SendNotificationToUserDto,
    ): Promise<{ message: string; messageId?: string }> {
        try {
            // Get user's FCM token
            const user = await this.userService.findByUsername(sendNotificationDto.username);
            if (!user) {
                throw new HttpException('User not found', HttpStatus.NOT_FOUND);
            }

            if (!user.fcmToken) {
                throw new HttpException('User has no FCM token', HttpStatus.BAD_REQUEST);
            }

            const notification: SendNotificationDto = {
                title: sendNotificationDto.title,
                body: sendNotificationDto.body,
                data: sendNotificationDto.data,
                imageUrl: sendNotificationDto.imageUrl,
            };

            const messageId = await this.firebaseService.sendNotificationToToken(
                user.fcmToken,
                notification,
            );

            return {
                message: 'Notification sent successfully',
                messageId,
            };
        } catch (error) {
            throw new HttpException(
                error.message || 'Failed to send notification',
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    @Post('send-notification-to-topic')
    @UseGuards(JwtAuthGuard)
    async sendNotificationToTopic(
        @Body() sendNotificationDto: SendNotificationToTopicDto,
    ): Promise<{ message: string; messageId?: string }> {
        try {
            const notification: SendNotificationDto = {
                title: sendNotificationDto.title,
                body: sendNotificationDto.body,
                data: sendNotificationDto.data,
                imageUrl: sendNotificationDto.imageUrl,
            };

            const messageId = await this.firebaseService.sendNotificationToTopic(
                sendNotificationDto.topic,
                notification,
            );

            return {
                message: 'Notification sent to topic successfully',
                messageId,
            };
        } catch (error) {
            throw new HttpException(
                error.message || 'Failed to send notification to topic',
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    @Post('subscribe-to-topic')
    @UseGuards(JwtAuthGuard)
    async subscribeToTopic(
        @Request() req,
        @Body() body: { topic: string },
    ): Promise<{ message: string }> {
        try {
            const user = await this.userService.findByUsername(req.user.username);
            if (!user) {
                throw new HttpException('User not found', HttpStatus.NOT_FOUND);
            }

            if (!user.fcmToken) {
                throw new HttpException('User has no FCM token', HttpStatus.BAD_REQUEST);
            }

            await this.firebaseService.subscribeToTopic(user.fcmToken, body.topic);

            return {
                message: `Successfully subscribed to topic: ${body.topic}`,
            };
        } catch (error) {
            throw new HttpException(
                error.message || 'Failed to subscribe to topic',
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    @Post('unsubscribe-from-topic')
    @UseGuards(JwtAuthGuard)
    async unsubscribeFromTopic(
        @Request() req,
        @Body() body: { topic: string },
    ): Promise<{ message: string }> {
        try {
            const user = await this.userService.findByUsername(req.user.username);
            if (!user) {
                throw new HttpException('User not found', HttpStatus.NOT_FOUND);
            }

            if (!user.fcmToken) {
                throw new HttpException('User has no FCM token', HttpStatus.BAD_REQUEST);
            }

            await this.firebaseService.unsubscribeFromTopic(user.fcmToken, body.topic);

            return {
                message: `Successfully unsubscribed from topic: ${body.topic}`,
            };
        } catch (error) {
            throw new HttpException(
                error.message || 'Failed to unsubscribe from topic',
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }
} 