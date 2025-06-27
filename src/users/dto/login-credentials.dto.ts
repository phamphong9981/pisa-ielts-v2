import { IsNotEmpty, IsString } from 'class-validator'

export class LoginCredentialsDto {
    @IsNotEmpty()
    @IsString()
    username: string

    @IsNotEmpty()
    @IsString()
    password: string
} 