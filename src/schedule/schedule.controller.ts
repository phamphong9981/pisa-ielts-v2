import {
    Body,
    Controller,
    Get,
    Post,
    Put,
    Request,
    UseGuards,
    UseInterceptors,
    HttpException,
    HttpStatus,
    BadRequestException,
    Param,
} from '@nestjs/common'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { TransformInterceptor } from '../interceptors/transform.interceptor'
import { ScheduleService } from './schedule.service'
import { CreateBusyScheduleDto } from './dto/create-busy-schedule.dto'
import { UpdateBusyScheduleDto } from './dto/update-busy-schedule.dto'
import { CreateScheduleDto } from './dto/create-schedule.dto'
import { AutoScheduleRequestDto, AutoScheduleResponseDto } from './dto/auto-schedule.dto'
import { UserSchedulesResponseDto, ClassScheduleResponseDto } from './dto/schedule-response.dto'
import { BusySchedule } from './busy-schedule.entity'
import { Schedule } from './schedule.entity'

@UseInterceptors(TransformInterceptor)
@Controller()
export class ScheduleController {
    constructor(private readonly scheduleService: ScheduleService) { }

    @Post('/order-schedule')
    @UseGuards(JwtAuthGuard)
    async createOrderSchedule(
        @Request() req,
        @Body() dto: CreateBusyScheduleDto,
    ) {
        try {
            const username = req.user.username
            return this.scheduleService.createOrderSchedule(username, dto)
        } catch (error) {
            if (error.code === '23505') { // Duplicate key
                throw new BadRequestException('Busy schedule already exists')
            }
            throw new HttpException(
                'Failed to create schedule',
                HttpStatus.INTERNAL_SERVER_ERROR,
            )
        }
    }

    @Get('/order-schedule')
    @UseGuards(JwtAuthGuard)
    async getOrderSchedule(
        @Request() req,
    ) {
        const username = req.user.username
        return this.scheduleService.getOrderSchedule(username)
    }

    @Put('/order-schedule')
    @UseGuards(JwtAuthGuard)
    async updateOrderSchedule(
        @Request() req,
        @Body() dto: UpdateBusyScheduleDto,
    ) {
        const username = req.user.username
        return this.scheduleService.updateOrderSchedule(username, dto)
    }

    @Post('/schedule')
    // @UseGuards(JwtAuthGuard)
    async createSchedule(
        @Body() dto: CreateScheduleDto,
    ) {
        return this.scheduleService.createSchedule(dto)
    }

    @Get('/schedule')
    @UseGuards(JwtAuthGuard)
    async getUserSchedules(
        @Request() req,
    ) {
        const username = req.user.username
        return this.scheduleService.getUserSchedules(username)
    }

    @Post('/auto-schedule')
    // @UseGuards(JwtAuthGuard)
    async autoSchedule(
        @Body() dto: AutoScheduleRequestDto,
    ) {
        return this.scheduleService.autoSchedule(dto)
    }

    @Get('schedule/class/:classId')
    // @UseGuards(JwtAuthGuard)
    async getClassSchedule(
        @Param('classId') classId: string,
    ): Promise<ClassScheduleResponseDto> {
        return this.scheduleService.getClassSchedule(classId)
    }
} 