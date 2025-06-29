import { IsArray, IsInt, Max, Min } from 'class-validator'
import { Expose } from 'class-transformer'

export class CreateTeacherOrderScheduleDto {
    @Expose({ name: 'registered_busy_schedule' })
    @IsArray()
    @IsInt({ each: true })
    @Min(1, { each: true })
    @Max(42, { each: true })
    registeredBusySchedule: number[]
} 