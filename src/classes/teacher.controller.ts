import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    HttpStatus,
    Param,
    ParseUUIDPipe,
    Post,
    Put,
    UseInterceptors,
    ValidationPipe,
} from '@nestjs/common'
import { TransformInterceptor } from 'src/interceptors/transform.interceptor'
import { TeacherService } from './teacher.service'
import { CreateTeacherDto } from './dto/create-teacher.dto'
import { UpdateTeacherDto } from './dto/update-teacher.dto'
import { CreateTeacherOrderScheduleDto } from './dto/create-teacher-order-schedule.dto'

@UseInterceptors(TransformInterceptor)
@Controller('teachers')
export class TeacherController {
    constructor(private readonly teacherService: TeacherService) { }

    @Post()
    @HttpCode(HttpStatus.OK)
    async createTeacher(
        @Body() createTeacherDto: CreateTeacherDto,
    ) {
        return this.teacherService.create(createTeacherDto)
    }

    @Get(':id')
    async getTeacher(
        @Param('id', ParseUUIDPipe) id: string,
    ) {
        return this.teacherService.findOne(id)
    }

    @Get()
    async listTeachers() {
        return this.teacherService.findAll()
    }

    @Put(':id')
    async updateTeacher(
        @Param('id', ParseUUIDPipe) id: string,
        @Body() updateTeacherDto: UpdateTeacherDto,
    ) {
        return this.teacherService.update(id, updateTeacherDto)
    }

    @Delete(':id')
    async deleteTeacher(
        @Param('id', ParseUUIDPipe) id: string,
    ) {
        return this.teacherService.remove(id)
    }

    @Put(':id/order-schedule')
    async createOrderSchedule(
        @Param('id', ParseUUIDPipe) id: string,
        @Body() orderScheduleDto: CreateTeacherOrderScheduleDto,
    ) {
        console.log(orderScheduleDto)
        return this.teacherService.createOrderSchedule(id, orderScheduleDto)
    }
} 