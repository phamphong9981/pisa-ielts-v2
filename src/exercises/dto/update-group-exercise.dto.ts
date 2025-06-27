import { IsNotEmpty, IsString } from 'class-validator'

export class UpdateGroupExerciseDto {
    @IsNotEmpty()
    @IsString()
    content: string
} 