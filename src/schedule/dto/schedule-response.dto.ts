export class ScheduleResponseDto {
    id: string
    scheduleTime: number
    startDate: Date
    name?: string
    classType?: string
    lesson: number
}

export class UserSchedulesResponseDto {
    schedules: ScheduleResponseDto[]
    total: number
} 