import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository, DataSource } from 'typeorm'
import { GroupExercise } from './group-exercise.entity'
import { Exercise } from './exercises.entity'
import { CreateGroupExerciseDto } from './dto/create-group-exercise.dto'
import { UpdateGroupExerciseDto } from './dto/update-group-exercise.dto'
import { GroupExerciseWithExercisesDto } from './dto/group-exercise-with-exercises.dto'

@Injectable()
export class GroupExercisesService {
    constructor(
        @InjectRepository(GroupExercise)
        private groupExerciseRepository: Repository<GroupExercise>,
        @InjectRepository(Exercise)
        private exerciseRepository: Repository<Exercise>,
        private dataSource: DataSource,
    ) { }

    async createGroupExercise(createGroupExerciseDto: CreateGroupExerciseDto): Promise<GroupExerciseWithExercisesDto> {
        const queryRunner = this.dataSource.createQueryRunner()
        await queryRunner.connect()
        await queryRunner.startTransaction()

        try {
            // Create group exercise first
            const groupExercise = queryRunner.manager.create(GroupExercise, {
                content: createGroupExerciseDto.content,
            })

            const savedGroupExercise = await queryRunner.manager.save(groupExercise)

            // Create exercises with the group_id
            const exercises = createGroupExerciseDto.exercises.map(exerciseDto => {
                const exercise = new Exercise()
                exercise.question = exerciseDto.question
                exercise.answer = exerciseDto.answer
                exercise.questionType = exerciseDto.questionType
                exercise.answerType = exerciseDto.answerType
                exercise.correctAnswer = exerciseDto.correctAnswer || []
                exercise.point = exerciseDto.point || 1
                exercise.groupId = savedGroupExercise.id
                return exercise
            })

            const savedExercises = await queryRunner.manager.save(Exercise, exercises)

            await queryRunner.commitTransaction()

            return {
                id: savedGroupExercise.id,
                content: savedGroupExercise.content,
                exercises: savedExercises,
                createdAt: savedGroupExercise.createdAt,
                updatedAt: savedGroupExercise.updatedAt,
            }
        } catch (error) {
            await queryRunner.rollbackTransaction()
            console.error('Failed to create group exercise:', error)
            throw new Error('Failed to create group exercise')
        } finally {
            await queryRunner.release()
        }
    }

    async findOne(id: string): Promise<GroupExerciseWithExercisesDto> {
        // Get group exercise
        const groupExercise = await this.groupExerciseRepository.findOne({ where: { id } })

        if (!groupExercise) {
            throw new NotFoundException('Group exercise not found')
        }

        // Get exercises in this group
        const exercises = await this.exerciseRepository.find({
            where: { groupId: id },
        })

        return {
            id: groupExercise.id,
            content: groupExercise.content,
            exercises,
            createdAt: groupExercise.createdAt,
            updatedAt: groupExercise.updatedAt,
        }
    }

    async findAll(): Promise<GroupExerciseWithExercisesDto[]> {
        // Get all group exercises
        const groupExercises = await this.groupExerciseRepository.find({
            order: { createdAt: 'DESC' },
        })

        // Get exercises for each group
        const result: GroupExerciseWithExercisesDto[] = []

        for (const groupExercise of groupExercises) {
            const exercises = await this.exerciseRepository.find({
                where: { groupId: groupExercise.id },
            })

            result.push({
                id: groupExercise.id,
                content: groupExercise.content,
                exercises,
                createdAt: groupExercise.createdAt,
                updatedAt: groupExercise.updatedAt,
            })
        }

        return result
    }

    async update(id: string, updateGroupExerciseDto: UpdateGroupExerciseDto): Promise<GroupExercise> {
        const groupExercise = await this.groupExerciseRepository.findOne({ where: { id } })

        if (!groupExercise) {
            throw new NotFoundException('Group exercise not found')
        }

        await this.groupExerciseRepository.update(id, {
            content: updateGroupExerciseDto.content,
        })

        return this.groupExerciseRepository.findOne({ where: { id } })
    }

    async remove(id: string): Promise<{ message: string }> {
        const groupExercise = await this.groupExerciseRepository.findOne({ where: { id } })

        if (!groupExercise) {
            throw new NotFoundException('Group exercise not found')
        }

        await this.groupExerciseRepository.remove(groupExercise)
        return { message: 'Group exercise deleted successfully' }
    }
} 