import { IsArray, IsBoolean, IsInt, IsNotEmpty, IsString, IsUUID, Min } from 'class-validator'
import { Expose } from 'class-transformer'

export class CreateSubmissionDto {
    @IsNotEmpty()
    @IsUUID()
    @Expose({ name: 'exercise_id' })
    exerciseId: string

    @IsNotEmpty()
    @IsArray()
    @IsString({ each: true })
    @Expose({ name: 'selected_answers' })
    selectedAnswers: string[]

    @IsNotEmpty()
    @IsBoolean()
    @Expose({ name: 'is_correct' })
    isCorrect: boolean

    @IsNotEmpty()
    @IsInt()
    @Min(0)
    point: number
} 