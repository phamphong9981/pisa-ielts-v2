import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Teacher } from './teacher.entity'
import { CreateTeacherDto } from './dto/create-teacher.dto'
import { UpdateTeacherDto } from './dto/update-teacher.dto'
import { CreateTeacherOrderScheduleDto } from './dto/create-teacher-order-schedule.dto'

@Injectable()
export class TeacherService {
    constructor(
        @InjectRepository(Teacher)
        private teacherRepository: Repository<Teacher>,
    ) { }

    async create(createTeacherDto: CreateTeacherDto): Promise<Teacher> {
        const teacher = this.teacherRepository.create({
            name: createTeacherDto.name,
            skills: createTeacherDto.skills,
        })

        return await this.teacherRepository.save(teacher)
    }

    async findOne(id: string): Promise<Teacher> {
        const teacher = await this.teacherRepository.findOne({ where: { id } })

        if (!teacher) {
            throw new NotFoundException('Teacher not found')
        }

        return teacher
    }

    async findAll(): Promise<Teacher[]> {
        return await this.teacherRepository.find({
            order: {
                name: 'ASC'
            }
        })
    }

    async update(id: string, updateTeacherDto: UpdateTeacherDto): Promise<Teacher> {
        const teacher = await this.findOne(id)

        teacher.name = updateTeacherDto.name
        teacher.skills = updateTeacherDto.skills

        return await this.teacherRepository.save(teacher)
    }

    async remove(id: string): Promise<{ message: string }> {
        const teacher = await this.findOne(id)
        await this.teacherRepository.remove(teacher)
        return { message: 'Teacher deleted successfully' }
    }

    async createOrderSchedule(id: string, orderScheduleDto: CreateTeacherOrderScheduleDto): Promise<Teacher> {
        const teacher = await this.findOne(id)

        teacher.registeredBusySchedule = orderScheduleDto.registeredBusySchedule

        return await this.teacherRepository.save(teacher)
    }
} 