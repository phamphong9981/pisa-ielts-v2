import { IsArray, IsEnum, IsNotEmpty, IsString } from 'class-validator'
import { TeacherSkill } from '../teacher.entity'

export class UpdateTeacherDto {
    @IsNotEmpty()
    @IsString()
    name: string

    @IsArray()
    @IsEnum(TeacherSkill, { each: true })
    skills: TeacherSkill[]
} 