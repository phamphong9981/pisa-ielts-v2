import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository, DataSource } from 'typeorm'
import { Submission } from './submission.entity'
import { Exercise } from './exercises.entity'
import { CreateSubmissionsDto } from './dto/create-submissions.dto'
import { CreateSubmissionDto } from './dto/create-submission.dto'

export interface SubmissionWithExercise {
    id: string
    profileId: string
    selectedAnswers: string[]
    isCorrect: boolean
    point: number
    createdAt: Date
    updatedAt: Date
    exercise: Exercise
}

@Injectable()
export class SubmissionService {
    constructor(
        @InjectRepository(Submission)
        private submissionRepository: Repository<Submission>,
        @InjectRepository(Exercise)
        private exerciseRepository: Repository<Exercise>,
        private dataSource: DataSource,
    ) { }

    async createSubmissions(username: string, createSubmissionsDto: CreateSubmissionsDto): Promise<Submission[]> {
        const queryRunner = this.dataSource.createQueryRunner()
        await queryRunner.connect()
        await queryRunner.startTransaction()
        console.log(createSubmissionsDto)
        try {
            // Get profile_id from username
            const profileQuery = `
                SELECT p.id FROM profiles p 
                JOIN users u ON p.user_id = u.id 
                WHERE u.username = $1
            `
            const profileResult = await queryRunner.query(profileQuery, [username])

            if (profileResult.length === 0) {
                throw new NotFoundException('Profile not found')
            }

            const profileId = profileResult[0].id
            const createdSubmissions: Submission[] = []

            // Insert each submission
            for (const submissionDto of createSubmissionsDto.submissions) {
                const submission = new Submission()
                submission.profileId = profileId
                submission.exerciseId = submissionDto.exerciseId
                submission.selectedAnswers = submissionDto.selectedAnswers
                submission.isCorrect = submissionDto.isCorrect
                submission.point = submissionDto.point
                createdSubmissions.push(submission)
            }

            await queryRunner.manager.save(Submission, createdSubmissions)
            await queryRunner.commitTransaction()
            return createdSubmissions
        } catch (error) {
            await queryRunner.rollbackTransaction()
            console.error('Database error:', error)
            throw new Error('Failed to create submissions')
        } finally {
            await queryRunner.release()
        }
    }

    async getSubmissionsByProfile(profileId: string): Promise<SubmissionWithExercise[]> {
        const query = `
            SELECT 
                s.id, s.profile_id, s.exercise_id, s.selected_answers, s.is_correct, s.point, s.created_at, s.updated_at,
                e.id as "exercise_id", e.question as "exercise_question", e.answer as "exercise_answer", 
                e.question_type as "exercise_question_type", e.answer_type as "exercise_answer_type",
                e.correct_answer as "exercise_correct_answer", e.point as "exercise_point", 
                e.group_id as "exercise_group_id", e.created_at as "exercise_created_at", 
                e.updated_at as "exercise_updated_at"
            FROM submissions s
            JOIN exercises e ON s.exercise_id = e.id
            WHERE s.profile_id = $1
            ORDER BY s.created_at DESC`

        const result = await this.dataSource.query(query, [profileId])
        if (result.length > 0) {
            const submissions: SubmissionWithExercise[] = result.map(row => {
                const submission = new Submission()
                submission.id = row.id
                submission.profileId = row.profile_id
                submission.selectedAnswers = row.selected_answers
                submission.isCorrect = row.is_correct
                submission.point = row.point
                submission.createdAt = row.created_at
                submission.updatedAt = row.updated_at
                submission.exercise = {
                    id: row.exercise_id,
                    question: row.exercise_question,
                    answer: row.exercise_answer,
                    questionType: row.exercise_question_type,
                    answerType: row.exercise_answer_type,
                    correctAnswer: row.exercise_correct_answer,
                    point: row.exercise_point,
                    groupId: row.exercise_group_id,
                    createdAt: row.exercise_created_at,
                    updatedAt: row.exercise_updated_at,
                } as Exercise
                return submission
            })
            return submissions
        }
    }
} 