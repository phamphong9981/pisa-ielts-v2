import { IsNotEmpty, IsString, MaxLength } from 'class-validator'

export class LoginCredentialsDto {
    @IsNotEmpty()
    @IsString()
    username: string

    @IsNotEmpty()
    @IsString()
    password: string

    @IsString()
    @IsNotEmpty()
    @MaxLength(255)
    fcmToken: string;
} 