import { IsNotEmpty, IsString } from 'class-validator'

export class UpdateProfileImageDto {
    @IsNotEmpty()
    @IsString()
    image: string
} 