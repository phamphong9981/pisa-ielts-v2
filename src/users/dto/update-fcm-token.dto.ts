import { IsString, IsNotEmpty, MaxLength } from 'class-validator';

export class UpdateFcmTokenDto {
    @IsString()
    @IsNotEmpty()
    @MaxLength(255)
    fcmToken: string;
} 