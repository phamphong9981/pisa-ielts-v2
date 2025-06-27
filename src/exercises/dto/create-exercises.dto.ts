import { Expose, Type } from 'class-transformer'
import { IsArray, ValidateNested } from 'class-validator'
import { CreateExerciseDto } from './create-exercise.dto'

export class CreateExercisesDto {
    @IsArray()
    // @ValidateNested({ each: true })
    @Type(() => CreateExerciseDto)
    exercises: CreateExerciseDto[]
} 