import { Type } from 'class-transformer'
import { IsArray, IsNotEmpty, IsString, ValidateNested } from 'class-validator'
import { CreateExerciseDto } from './create-exercise.dto'

export class CreateGroupExerciseDto {
    @IsNotEmpty()
    @IsString()
    content: string

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreateExerciseDto)
    exercises: CreateExerciseDto[]
} 