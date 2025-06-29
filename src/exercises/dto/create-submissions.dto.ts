import { IsArray, ValidateNested } from 'class-validator'
import { Type } from 'class-transformer'
import { CreateSubmissionDto } from './create-submission.dto'

export class CreateSubmissionsDto {
    @IsArray()
    // @ValidateNested({ each: true })
    @Type(() => CreateSubmissionDto)
    submissions: CreateSubmissionDto[]
} 