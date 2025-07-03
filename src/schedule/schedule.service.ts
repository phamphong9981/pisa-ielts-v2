import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Schedule } from './schedule.entity'
import { BusySchedule } from './busy-schedule.entity'
import { CreateBusyScheduleDto } from './dto/create-busy-schedule.dto'
import { UpdateBusyScheduleDto } from './dto/update-busy-schedule.dto'
import { CreateScheduleDto } from './dto/create-schedule.dto'
import { AutoScheduleRequestDto, AutoScheduleResponseDto } from './dto/auto-schedule.dto'
import { ScheduleResponseDto, UserSchedulesResponseDto, ClassScheduleResponseDto, ClassScheduleDto, StudentScheduleDto, LessonScheduleDto, StudentAbsentDto } from './dto/schedule-response.dto'
import { SCHEDULE_TIME } from 'src/config/schedule.constant'

@Injectable()
export class ScheduleService {
    constructor(
        @InjectRepository(Schedule)
        private readonly scheduleRepository: Repository<Schedule>,
        @InjectRepository(BusySchedule)
        private readonly busyScheduleRepository: Repository<BusySchedule>,
    ) { }

    async createOrderSchedule(username: string, dto: CreateBusyScheduleDto): Promise<BusySchedule> {
        return this.scheduleRepository.manager.transaction(async (manager) => {
            // Get profile_id from username
            const profileQuery = `
        SELECT p.id FROM profiles p 
        JOIN users u ON p.user_id = u.id 
        WHERE u.username = $1
      `
            const profileResult = await manager.query(profileQuery, [username])
            if (!profileResult.length) {
                throw new HttpException('Profile not found', HttpStatus.NOT_FOUND)
            }
            const profileId = profileResult[0].id

            // Get week_id from open week
            const weekQuery = `SELECT id FROM week WHERE schedule_status = 'open'`
            const weekResult = await manager.query(weekQuery)
            if (!weekResult.length) {
                throw new HttpException('Week not found. Please create the week first.', HttpStatus.NOT_FOUND)
            }
            const weekId = weekResult[0].id

            // Check if week is open for scheduling
            const weekStatusQuery = `SELECT schedule_status FROM week WHERE id = $1`
            const weekStatusResult = await manager.query(weekStatusQuery, [weekId])
            const weekStatus = weekStatusResult[0]?.schedule_status

            if (weekStatus !== 'open') {
                throw new HttpException(
                    `Cannot create schedule. Week is ${weekStatus}`,
                    HttpStatus.BAD_REQUEST
                )
            }

            // Validate busy_schedule_arr values
            if (dto.busyScheduleArr.some(x => x < 1 || x > 42)) {
                throw new HttpException(
                    'Schedule values must be between 1 and 42',
                    HttpStatus.BAD_REQUEST
                )
            }

            // Insert new schedule
            const busySchedule = this.busyScheduleRepository.create({
                profileId,
                weekId,
                busyScheduleArr: dto.busyScheduleArr,
            })

            return manager.save(busySchedule)
        })
    }

    async getOrderSchedule(username: string): Promise<BusySchedule | null> {
        const query = `
      SELECT bs.* 
      FROM busy_schedule bs
      JOIN week w ON bs.week_id = w.id
      JOIN profiles p ON bs.profile_id = p.id
      JOIN users u ON p.user_id = u.id
      WHERE u.username = $1 AND w.schedule_status = 'open'
    `

        const result = await this.busyScheduleRepository.query(query, [username])
        if (!result.length) {
            return null
        }

        return result[0]
    }

    async updateOrderSchedule(username: string, dto: UpdateBusyScheduleDto): Promise<BusySchedule> {
        // Validate busy_schedule_arr values
        if (dto.busyScheduleArr.some(x => x < 1 || x > 42)) {
            throw new HttpException(
                'Schedule values must be between 1 and 42',
                HttpStatus.BAD_REQUEST
            )
        }

        const updateQuery = `
      UPDATE busy_schedule bs
      SET busy_schedule_arr = $1, updated_at = CURRENT_TIMESTAMP
      FROM week w, profiles p, users u
      WHERE bs.week_id = w.id
      AND bs.profile_id = p.id
      AND p.user_id = u.id
      AND u.username = $2
      AND w.schedule_status = 'open'
      RETURNING bs.id, bs.profile_id, bs.week_id, bs.busy_schedule_arr, bs.created_at, bs.updated_at
    `

        const result = await this.busyScheduleRepository.query(updateQuery, [
            dto.busyScheduleArr,
            username,
        ])

        if (!result.length) {
            throw new HttpException(
                'Schedule not found for the specified week',
                HttpStatus.NOT_FOUND
            )
        }

        return result[0]
    }

    async createSchedule(dto: CreateScheduleDto): Promise<Schedule> {
        return this.scheduleRepository.manager.transaction(async (manager) => {
            // Validate schedule_time range
            if (dto.scheduleTime < 1 || dto.scheduleTime > 42) {
                throw new HttpException(
                    'Schedule time must be between 1 and 42',
                    HttpStatus.BAD_REQUEST
                )
            }

            // Verify profile_lesson_class exists
            const profileLessonClassQuery = `SELECT id FROM profile_lesson_class WHERE id = $1`
            const profileLessonClassResult = await manager.query(profileLessonClassQuery, [
                dto.profileLessonClassId,
            ])

            if (!profileLessonClassResult.length) {
                throw new HttpException('Profile lesson class not found', HttpStatus.NOT_FOUND)
            }

            // Verify week exists and is open
            const weekQuery = `SELECT schedule_status FROM week WHERE id = $1`
            const weekResult = await manager.query(weekQuery, [dto.weekId])

            if (!weekResult.length) {
                throw new HttpException('Week not found', HttpStatus.NOT_FOUND)
            }

            const weekStatus = weekResult[0].schedule_status
            if (weekStatus !== 'open') {
                throw new HttpException(
                    `Cannot create schedule. Week is ${weekStatus}`,
                    HttpStatus.BAD_REQUEST
                )
            }

            // Check if schedule already exists
            const existingSchedule = await manager.findOne(Schedule, {
                where: {
                    profileLessonClassId: dto.profileLessonClassId,
                    weekId: dto.weekId,
                },
            })

            if (existingSchedule) {
                throw new HttpException(
                    'Schedule already exists for this profile lesson class and week',
                    HttpStatus.BAD_REQUEST
                )
            }

            // Insert new schedule
            const schedule = this.scheduleRepository.create(dto)
            return manager.save(schedule)
        })
    }

    async getUserSchedules(username: string): Promise<UserSchedulesResponseDto> {
        const query = `
      SELECT s.id, s.schedule_time, w.start_date, c.name, c.class_type, plc.lesson
      FROM schedule s
      JOIN profile_lesson_class plc ON s.profile_lesson_class_id = plc.id
      JOIN class c ON plc.class_id = c.id
      JOIN profiles p ON plc.profile_id = p.id
      JOIN users u ON p.user_id = u.id
      JOIN week w ON s.week_id = w.id
      WHERE u.username = $1
      AND w.schedule_status = 'open'
      ORDER BY w.start_date DESC, s.schedule_time ASC
    `

        const result = await this.scheduleRepository.query(query, [username])

        const schedules: ScheduleResponseDto[] = result.map(row => ({
            id: row.id,
            scheduleTime: row.schedule_time,
            startDate: row.start_date,
            className: row.name,
            classType: row.class_type,
            lesson: row.lesson,
        }))

        return {
            schedules,
        }
    }

    async autoSchedule(dto: AutoScheduleRequestDto) {
        return this.scheduleRepository.manager.transaction(async (manager) => {
            // 1.1 Get current week
            const weekQuery = `SELECT id FROM week WHERE schedule_status = 'open'`
            const weekResult = await manager.query(weekQuery)
            if (!weekResult.length) {
                throw new HttpException('Week not found', HttpStatus.NOT_FOUND)
            }
            const weekId = weekResult[0].id
            // 1.2 Get class information
            const classQuery = `
        SELECT c.id, c.teacher_id, c.total_student, c.total_lesson_per_week, t.name as teacher_name, t.registered_busy_schedule as teacher_busy_schedule, plc.id as profile_lesson_class_id, plc.lesson as lesson
        FROM class c
        LEFT JOIN teachers t ON c.teacher_id = t.id
        LEFT JOIN profile_lesson_class plc ON c.id = plc.class_id
        WHERE c.id = $1
      `

            const classResult = await manager.query(classQuery, [dto.classId])
            if (!classResult.length) {
                throw new HttpException('Class not found', HttpStatus.NOT_FOUND)
            }

            const classInfo = classResult[0]
            console.log(classResult);
            const teacherId = classInfo.teacher_id
            const totalStudents = classInfo.total_student
            const totalLessons = classInfo.total_lesson_per_week
            const teacherSchedule = classInfo.teacher_busy_schedule || []
            if (!teacherId) {
                throw new HttpException('Class has no teacher', HttpStatus.BAD_REQUEST)
            }

            // 2. Get active schedule slots from config
            const configQuery = `SELECT value FROM configs WHERE key = 'active_schedule'`
            const configResult = await manager.query(configQuery)
            if (!configResult.length) {
                throw new HttpException('Active schedule configuration not found', HttpStatus.NOT_FOUND)
            }

            const activeSchedule = configResult[0].value
            const activeSlots = activeSchedule
                .split(',')
                .map(s => parseInt(s.trim()))
                .filter(n => !isNaN(n))


            // 4. Get students' busy schedules
            const studentsQuery = `
                SELECT p.id as profile_id, COALESCE(bs.busy_schedule_arr, '{}') as busy_schedule_arr
                FROM profiles p
                JOIN profile_lesson_class plc ON p.id = plc.profile_id
                LEFT JOIN busy_schedule bs ON p.id = bs.profile_id
                LEFT JOIN week w ON bs.week_id = w.id
                WHERE plc.class_id = $1 AND w.id = $2
              `

            const studentSchedules = await manager.query(studentsQuery, [dto.classId, weekId])

            // 5. Find available slots
            const availableSlots = activeSlots.filter(slot => !teacherSchedule.includes(slot))

            // Count student availability for each slot
            const slotAvailability = new Map<number, number>()

            for (const slot of availableSlots) {
                let availableCount = 0
                for (const student of studentSchedules) {
                    const busyArr = student.busy_schedule_arr || []
                    if (!busyArr.includes(slot)) {
                        availableCount++
                    }
                }

                // Calculate participation rate for this slot
                const slotParticipationRate = totalStudents > 0 ? availableCount / totalStudents : 0

                // Only include slots with >70% participation
                if (slotParticipationRate > 0.7) {
                    slotAvailability.set(slot, availableCount)
                }
            }

            // Sort slots by student availability
            const sortedSlots = Array.from(slotAvailability.entries())
                .sort((a, b) => b[1] - a[1])
                .map(entry => entry[0])

            // Select top slots based on total_lessons
            const selectedSlots = sortedSlots.slice(0, totalLessons)

            // insert schedule
            const newSchedules = []
            for (const [index, slot] of selectedSlots.entries()) {
                const schedules = classResult.filter(x => x.lesson === index + 1).map(x => ({
                    profileLessonClassId: x.profile_lesson_class_id,
                    weekId: weekId,
                    scheduleTime: slot,
                }))
                newSchedules.push(...schedules)
            }
            await manager.save(Schedule, newSchedules)
            return {
                classId: dto.classId,
                teacherId,
                lessons: selectedSlots.map(slot => ({
                    totalStudents,
                    participatingStudents: slotAvailability.get(slot) || 0,
                    participationRate: slotAvailability.get(slot) / totalStudents,
                    scheduleSlot: slot,
                })),
            }
        })
    }

    async getClassSchedule(classId: string): Promise<ClassScheduleResponseDto> {
        // 1. Get class info and open week
        const classInfoQuery = `
            SELECT c.id, c.name, c.class_type, c.teacher_id, w.id as week_id, w.start_date
            FROM class c
            CROSS JOIN week w
            WHERE c.id = $1 AND w.schedule_status = 'open'
        `
        const classInfoResult = await this.scheduleRepository.query(classInfoQuery, [classId])

        if (!classInfoResult.length) {
            throw new HttpException('Class not found or no open week available', HttpStatus.NOT_FOUND)
        }

        const classInfo = classInfoResult[0]
        const weekId = classInfo.week_id

        // 2. Get all students with their lesson and schedule info (LEFT JOIN to include absent students)
        const query = `
            SELECT 
                p.id as profile_id,
                p.fullname,
                p.email,
                plc.lesson,
                s.schedule_time,
                s.id as schedule_id
            FROM profile_lesson_class plc
            JOIN profiles p ON plc.profile_id = p.id
            LEFT JOIN schedule s ON plc.id = s.profile_lesson_class_id AND s.week_id = $2
            WHERE plc.class_id = $1
            ORDER BY plc.lesson ASC, p.fullname ASC
        `

        const result = await this.scheduleRepository.query(query, [classId, weekId])

        if (!result.length) {
            throw new HttpException('Class not found or no students in class', HttpStatus.NOT_FOUND)
        }

        // 3. Get busy schedules for students to determine absence reason
        const busyScheduleQuery = `
            SELECT 
                bs.profile_id,
                bs.busy_schedule_arr
            FROM busy_schedule bs
            WHERE bs.profile_id IN (
                SELECT plc.profile_id FROM profile_lesson_class plc WHERE plc.class_id = $1
            ) AND bs.week_id = $2
        `
        const busyScheduleResult = await this.scheduleRepository.query(busyScheduleQuery, [classId, weekId])

        // Create busy schedule map for lookup
        const busyScheduleMap = new Map<string, number[]>()
        busyScheduleResult.forEach(bs => {
            busyScheduleMap.set(bs.profile_id, bs.busy_schedule_arr || [])
        })

        // 4. Group by lesson and classify students
        const lessonMap = new Map<number, any>()

        for (const row of result) {
            if (!lessonMap.has(row.lesson)) {
                lessonMap.set(row.lesson, {
                    lesson: row.lesson,
                    scheduleTime: null,
                    attendingStudents: [],
                    absentStudents: [],
                })
            }

            const lessonData = lessonMap.get(row.lesson)!

            if (row.schedule_id) {
                // Student has schedule - attending
                lessonData.scheduleTime = row.schedule_time
                lessonData.attendingStudents.push({
                    profileId: row.profile_id,
                    fullname: row.fullname,
                    email: row.email,
                    scheduleTime: row.schedule_time,
                })
            } else {
                const busySchedule = busyScheduleMap.get(row.profile_id) || []

                lessonData.absentStudents.push({
                    profileId: row.profile_id,
                    fullname: row.fullname,
                    email: row.email,
                    busySchedule: busySchedule.map(x => SCHEDULE_TIME[x - 1]),
                })
            }
        }

        // 5. Convert to final format
        const lessons: LessonScheduleDto[] = Array.from(lessonMap.values()).map(lessonData => ({
            lesson: lessonData.lesson,
            scheduleTime: lessonData.scheduleTime || 0,
            attendingStudents: lessonData.attendingStudents,
            absentStudents: lessonData.absentStudents,
            totalStudents: lessonData.attendingStudents.length + lessonData.absentStudents.length,
            attendingCount: lessonData.attendingStudents.length,
            absentCount: lessonData.absentStudents.length,
        })).sort((a, b) => a.lesson - b.lesson)

        const classSchedule: ClassScheduleDto = {
            classId: classInfo.id,
            className: classInfo.name,
            classType: classInfo.class_type,
            teacherId: classInfo.teacher_id,
            weekId: classInfo.week_id,
            startDate: classInfo.start_date,
            lessons,
        }

        return {
            classSchedule,
        }
    }
} 