import { Expose } from 'class-transformer'
import { IsArray, IsNumber, Max, Min } from 'class-validator'

export class UpdateBusyScheduleDto {
    @IsArray()
    @IsNumber({}, { each: true })
    @Min(1, { each: true })
    @Max(42, { each: true })
    @Expose({ name: 'busy_schedule_arr' })
    busyScheduleArr: number[]
} 