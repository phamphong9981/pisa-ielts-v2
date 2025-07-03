export class ScheduleResponseDto {
    id: string
    scheduleTime: number
    startDate: string
    className: string
    classType: string
    lesson: number
}

export class UserSchedulesResponseDto {
    schedules: ScheduleResponseDto[]
}

export class StudentScheduleDto {
    profileId: string
    fullname: string
    email: string
    scheduleId: string
}

export class LessonScheduleDto {
    lesson: number
    scheduleTime: number
    students: StudentScheduleDto[]
}

export class ClassScheduleDto {
    classId: string
    className: string
    classType: string
    teacherId: string
    weekId: string
    startDate: string
    lessons: LessonScheduleDto[]
}

export class ClassScheduleResponseDto {
    classSchedule: ClassScheduleDto
} 