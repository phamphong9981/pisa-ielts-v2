import { IsEnum, IsNotEmpty, IsOptional, IsString, IsUUID, IsNumber } from 'class-validator'
import { ClassType } from '../class.entity'
import { Expose, Transform } from 'class-transformer'
import { ApiProperty } from '@nestjs/swagger'

export class UpdateClassDto {
    @IsOptional()
    @IsString()
    name?: string

    @IsOptional()
    @IsNumber()
    @Expose({ name: 'total_student' })
    totalStudent?: number

    @IsOptional()
    @IsNumber()
    @Expose({ name: 'total_lesson_per_week' })
    totalLessonPerWeek?: number

    @IsOptional()
    @IsEnum(ClassType)
    @Expose({ name: 'class_type' })
    classType?: ClassType

    @IsOptional()
    @IsUUID()
    @Expose({ name: 'teacher_id' })
    teacherId?: string
} 