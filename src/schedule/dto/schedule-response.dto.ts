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
    scheduleTime: number
}

export class StudentAbsentDto {
    profileId: string
    fullname: string
    email: string
    busySchedule: string[]
}

export class LessonScheduleDto {
    lesson: number
    scheduleTime: number
    attendingStudents: StudentScheduleDto[]
    absentStudents: StudentAbsentDto[]
    totalStudents: number
    attendingCount: number
    absentCount: number
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