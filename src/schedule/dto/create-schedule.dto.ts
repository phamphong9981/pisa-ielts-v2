import { Expose } from 'class-transformer'
import { IsUUID, IsNumber, Min, Max } from 'class-validator'

export class CreateScheduleDto {
    @IsUUID()
    @Expose({ name: 'profile_lesson_class_id' })
    profileLessonClassId: string

    @IsUUID()
    @Expose({ name: 'week_id' })
    weekId: string

    @IsNumber()
    @Min(1)
    @Max(42)
    @Expose({ name: 'schedule_time' })
    scheduleTime: number
} 