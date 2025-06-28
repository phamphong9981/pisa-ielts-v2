import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ScheduleController } from './schedule.controller'
import { ScheduleService } from './schedule.service'
import { Schedule } from './schedule.entity'
import { BusySchedule } from './busy-schedule.entity'

@Module({
    imports: [TypeOrmModule.forFeature([Schedule, BusySchedule])],
    controllers: [ScheduleController],
    providers: [ScheduleService],
    exports: [ScheduleService],
})
export class ScheduleModule { } 