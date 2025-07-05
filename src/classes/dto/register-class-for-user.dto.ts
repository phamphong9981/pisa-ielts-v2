import { Expose } from "class-transformer"
import { IsNotEmpty, IsString, IsUUID } from "class-validator"

export class RegisterClassForUserDto {
    @IsNotEmpty()
    @IsUUID()
    @Expose({ name: 'class_id' })
    classId: string

    @IsNotEmpty()
    @IsString()
    username: string
}