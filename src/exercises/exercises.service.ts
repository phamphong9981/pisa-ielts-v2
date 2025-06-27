import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository, DataSource } from 'typeorm'
import { Exercise } from './exercises.entity'
import { CreateExerciseDto } from './dto/create-exercise.dto'
import { CreateExercisesDto } from './dto/create-exercises.dto'
import { UpdateExerciseDto } from './dto/update-exercise.dto'
import { ListExercisesDto } from './dto/list-exercises.dto'

@Injectable()
export class ExercisesService {
    constructor(
        @InjectRepository(Exercise)
        private exerciseRepository: Repository<Exercise>,
        private dataSource: DataSource,
    ) { }

    async createExercises(createExercisesDto: CreateExercisesDto): Promise<Exercise[]> {
        // Validate input
        if (!createExercisesDto.exercises || createExercisesDto.exercises.length === 0) {
            throw new Error('No exercises provided')
        }

        const queryRunner = this.dataSource.createQueryRunner()
        await queryRunner.connect()
        await queryRunner.startTransaction()

        try {
            // Prepare exercises entities
            const exercises = createExercisesDto.exercises.map(exerciseDto => {
                const exercise = new Exercise()
                exercise.question = exerciseDto.question
                exercise.answer = exerciseDto.answer
                exercise.questionType = exerciseDto.questionType
                exercise.answerType = exerciseDto.answerType
                exercise.correctAnswer = exerciseDto.correctAnswer || []
                exercise.point = exerciseDto.point || 1
                exercise.groupId = exerciseDto.groupId || null
                return exercise
            })

            // Use repository save with array for batch insert
            const savedExercises = await queryRunner.manager.save(Exercise, exercises)
            await queryRunner.commitTransaction()

            return savedExercises
        } catch (error) {
            await queryRunner.rollbackTransaction()
            console.error('Failed to create exercises batch:', error)
            throw new Error('Failed to create exercises')
        } finally {
            await queryRunner.release()
        }
    }

    async findOne(id: string): Promise<Exercise> {
        const exercise = await this.exerciseRepository.findOne({ where: { id } })

        if (!exercise) {
            throw new NotFoundException('Exercise not found')
        }

        return exercise
    }

    async findAll(filters: ListExercisesDto): Promise<Exercise[]> {
        const queryBuilder = this.exerciseRepository
            .createQueryBuilder('exercise')
            .where('exercise.groupId IS NULL')

        if (filters.questionType) {
            queryBuilder.andWhere('exercise.questionType = :questionType', {
                questionType: filters.questionType,
            })
        }

        if (filters.answerType) {
            queryBuilder.andWhere('exercise.answerType = :answerType', {
                answerType: filters.answerType,
            })
        }

        queryBuilder.orderBy('exercise.createdAt', 'DESC')

        return queryBuilder.getMany()
    }

    async update(id: string, updateExerciseDto: UpdateExerciseDto): Promise<Exercise> {
        const exercise = await this.findOne(id)

        // Build update object dynamically based on provided fields
        const updateData: Partial<Exercise> = {}

        if (updateExerciseDto.question !== undefined) {
            updateData.question = updateExerciseDto.question
        }
        if (updateExerciseDto.answer !== undefined) {
            updateData.answer = updateExerciseDto.answer
        }
        if (updateExerciseDto.questionType !== undefined) {
            updateData.questionType = updateExerciseDto.questionType
        }
        if (updateExerciseDto.answerType !== undefined) {
            updateData.answerType = updateExerciseDto.answerType
        }
        if (updateExerciseDto.correctAnswer !== undefined) {
            updateData.correctAnswer = updateExerciseDto.correctAnswer
        }
        if (updateExerciseDto.point !== undefined) {
            updateData.point = updateExerciseDto.point
        }

        // Check if there are any fields to update
        if (Object.keys(updateData).length === 0) {
            throw new Error('No fields to update')
        }

        await this.exerciseRepository.update(id, updateData)
        return this.findOne(id)
    }

    async remove(id: string): Promise<{ message: string }> {
        const exercise = await this.findOne(id)
        await this.exerciseRepository.remove(exercise)
        return { message: 'Exercise deleted successfully' }
    }
} 