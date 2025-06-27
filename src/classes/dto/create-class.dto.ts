import { IsEnum, IsNotEmpty, IsOptional, IsString, IsUUID, IsNumber } from 'class-validator'
import { ClassType } from '../class.entity'
import { Expose, Transform } from 'class-transformer'
import { ApiProperty } from '@nestjs/swagger'

export class CreateClassDto {
    @IsNotEmpty()
    @IsString()
    name: string

    @IsOptional()
    @IsNumber()
    @Expose({ name: 'total_student' })
    totalStudent?: number

    @IsOptional()
    @IsNumber()
    @Expose({ name: 'total_lesson_per_week' })
    totalLessonPerWeek?: number

    @IsNotEmpty()
    @IsEnum(ClassType)
    @Expose({ name: 'class_type' })
    classType: ClassType

    @IsNotEmpty()
    @IsUUID()
    @Expose({ name: 'teacher_id' })
    teacherId: string
} 