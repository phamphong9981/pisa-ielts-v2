// src/notification/dto/send-notification.dto.ts
import { IsNotEmpty, IsString } from 'class-validator';

export class SendNotificationDto {
    @IsString()
    @IsNotEmpty()
    token: string; // Device token của người nhận

    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    @IsNotEmpty()
    body: string;
}