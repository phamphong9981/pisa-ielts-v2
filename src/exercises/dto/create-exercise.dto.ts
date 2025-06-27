import { IsEnum, IsNotEmpty, IsOptional, IsString, IsUUID, IsInt, Min, IsArray } from 'class-validator'
import { QuestionType, AnswerType } from '../exercises.entity'
import { Expose } from 'class-transformer'

export class CreateExerciseDto {
    @IsNotEmpty()
    @IsString()
    question: string

    @IsNotEmpty()
    @IsArray()
    @IsString({ each: true })
    answer: string[]

    @IsNotEmpty()
    @IsEnum(QuestionType)
    @Expose({ name: 'question_type' })
    questionType: QuestionType

    @IsNotEmpty()
    @IsEnum(AnswerType)
    @Expose({ name: 'answer_type' })
    answerType: AnswerType

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    @Expose({ name: 'correct_answer' })
    correctAnswer: string[]

    @IsOptional()
    @IsInt()
    @Min(1)
    point?: number

    @IsOptional()
    @IsUUID()
    @Expose({ name: 'group_id' })
    groupId?: string
} 