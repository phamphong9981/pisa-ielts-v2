import { Expose } from 'class-transformer'
import { IsUUID } from 'class-validator'

export class AutoScheduleRequestDto {
    @IsUUID()
    @Expose({ name: 'class_id' })
    classId: string
}

export class AutoScheduleLessonDto {
    @Expose({ name: 'total_students' })
    totalStudents: number
    @Expose({ name: 'participating_students' })
    participatingStudents: number
    @Expose({ name: 'participation_rate' })
    participationRate: number
    @Expose({ name: 'schedule_slot' })
    scheduleSlot: number
}
export class AutoScheduleResponseDto {
    @Expose({ name: 'class_id' })
    classId: string
    @Expose({ name: 'teacher_id' })
    teacherId: string
    @Expose({ name: 'lessons' })
    lessons: AutoScheduleLessonDto[]
} 