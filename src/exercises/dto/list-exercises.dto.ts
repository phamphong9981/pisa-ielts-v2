import { IsEnum, IsOptional } from 'class-validator'
import { QuestionType, AnswerType } from '../exercises.entity'
import { Expose } from 'class-transformer'

export class ListExercisesDto {
    @IsOptional()
    @IsEnum(QuestionType)
    @Expose({ name: 'question_type' })
    questionType?: QuestionType

    @IsOptional()
    @IsEnum(AnswerType)
    @Expose({ name: 'answer_type' })
    answerType?: AnswerType
} 