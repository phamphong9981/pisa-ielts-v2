import { IsEnum, IsOptional, IsString, IsInt, Min, IsArray } from 'class-validator'
import { QuestionType, AnswerType } from '../exercises.entity'
import { Expose } from 'class-transformer'

export class UpdateExerciseDto {
    @IsOptional()
    @IsString()
    question?: string

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    answer?: string[]

    @IsOptional()
    @IsEnum(QuestionType)
    @Expose({ name: 'question_type' })
    questionType?: QuestionType

    @IsOptional()
    @IsEnum(AnswerType)
    @Expose({ name: 'answer_type' })
    answerType?: AnswerType

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    @Expose({ name: 'correct_answer' })
    correctAnswer?: string[]

    @IsOptional()
    @IsInt()
    @Min(1)
    point?: number
} 