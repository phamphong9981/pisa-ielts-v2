import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository, DataSource } from 'typeorm'
import { Class } from './class.entity'
import { ProfileLessonClass } from './profile-lesson-class.entity'
import { CreateClassDto } from './dto/create-class.dto'

@Injectable()
export class ClassService {
    constructor(
        @InjectRepository(Class)
        private readonly classRepository: Repository<Class>,
        @InjectRepository(ProfileLessonClass)
        private readonly profileLessonClassRepository: Repository<ProfileLessonClass>,
        private readonly dataSource: DataSource,
    ) { }

    async createClass(createClassDto: CreateClassDto): Promise<Class> {
        try {
            const newClass = this.classRepository.create({
                name: createClassDto.name,
                totalStudent: createClassDto.totalStudent || 0,
                totalLessonPerWeek: createClassDto.totalLessonPerWeek || 0,
                classType: createClassDto.classType,
                teacherId: createClassDto.teacherId || null,
            })

            return await this.classRepository.save(newClass)
        } catch (error) {
            if (error.code === '23505') { // Duplicate key
                throw new BadRequestException('Class with this name already exists')
            }
            if (error.code === '23503') { // Foreign key constraint
                throw new BadRequestException('Teacher not found')
            }
            throw new BadRequestException('Failed to create class')
        }
    }

    async getClassById(id: string): Promise<any> {
        const queryRunner = this.dataSource.createQueryRunner()
        await queryRunner.connect()
        await queryRunner.startTransaction()

        try {
            // Get class information with teacher
            const classInfo = await queryRunner.query(`
        SELECT 
          c.id, 
          c.name, 
          c.total_student, 
          c.total_lesson_per_week, 
          c.class_type, 
          c.teacher_id,
          c.created_at, 
          c.updated_at,
          t.fullname as teacher_name
        FROM class c
        LEFT JOIN profiles t ON c.teacher_id = t.id
        WHERE c.id = $1
      `, [id])

            if (classInfo.length === 0) {
                throw new NotFoundException('Class not found')
            }

            const classData = classInfo[0]

            // Get students information from profile_lesson_class
            const students = await queryRunner.query(`
        SELECT DISTINCT 
          p.id as profile_id,
          u.username as username,
          p.fullname as full_name,
          p.phone as phone_number,
          p.email,
          ARRAY_AGG(plc.lesson ORDER BY plc.lesson) as lessons
        FROM profile_lesson_class plc
        JOIN profiles p ON p.id = plc.profile_id
        JOIN users u ON u.id = p.user_id
        WHERE plc.class_id = $1
        GROUP BY p.id, u.username, p.fullname, p.phone, p.email
        ORDER BY p.fullname
      `, [id])

            await queryRunner.commitTransaction()

            return {
                id: classData.id,
                name: classData.name,
                totalStudent: classData.total_student,
                totalLessonPerWeek: classData.total_lesson_per_week,
                classType: classData.class_type,
                teacherId: classData.teacher_id,
                teacherName: classData.teacher_name,
                createdAt: classData.created_at,
                updatedAt: classData.updated_at,
                students: students.map(s => ({
                    profileId: s.profile_id,
                    username: s.username,
                    fullName: s.full_name,
                    phoneNumber: s.phone_number,
                    email: s.email,
                    lessons: s.lessons
                }))
            }
        } catch (error) {
            await queryRunner.rollbackTransaction()
            throw error
        } finally {
            await queryRunner.release()
        }
    }

    async listClasses(): Promise<Class[]> {
        return await this.classRepository.find({
            order: { createdAt: 'DESC' }
        })
    }

    async registerForClass(classId: string, username: string): Promise<any> {
        const queryRunner = this.dataSource.createQueryRunner()
        await queryRunner.connect()
        await queryRunner.startTransaction()

        try {
            // Get profile_id from username
            const profileResult = await queryRunner.query(`
        SELECT p.id FROM profiles p 
        JOIN users u ON p.user_id = u.id 
        WHERE u.username = $1
      `, [username])

            if (profileResult.length === 0) {
                throw new NotFoundException('Profile not found')
            }

            const profileId = profileResult[0].id

            // Get class and verify it exists
            const classResult = await queryRunner.query(`
        SELECT total_lesson_per_week FROM class WHERE id = $1
      `, [classId])

            if (classResult.length === 0) {
                throw new NotFoundException('Class not found')
            }

            const totalLessons = classResult[0].total_lesson_per_week

            // Check if user is already registered for this class
            const existingRegistration = await queryRunner.query(`
        SELECT id FROM profile_lesson_class 
        WHERE profile_id = $1 AND class_id = $2 
        LIMIT 1
      `, [profileId, classId])

            if (existingRegistration.length > 0) {
                throw new BadRequestException('Already registered for this class')
            }

            const createdLessons = []

            // Create entries for each lesson
            for (let lessonNum = 1; lessonNum <= totalLessons; lessonNum++) {
                const lessonResult = await queryRunner.query(`
          INSERT INTO profile_lesson_class (profile_id, class_id, lesson)
          VALUES ($1, $2, $3)
          RETURNING id, profile_id, class_id, lesson, created_at, updated_at
        `, [profileId, classId, lessonNum])

                createdLessons.push(lessonResult[0])
            }

            // Increment total_student in the class table
            await queryRunner.query(`
        UPDATE class SET total_student = total_student + 1 WHERE id = $1
      `, [classId])

            await queryRunner.commitTransaction()

            return {
                message: 'Successfully registered for class',
                lessons: createdLessons
            }
        } catch (error) {
            await queryRunner.rollbackTransaction()
            throw error
        } finally {
            await queryRunner.release()
        }
    }
} 