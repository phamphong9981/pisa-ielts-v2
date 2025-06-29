import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm'
import { Exercise } from './exercises.entity'

@Entity({ name: 'submissions' })
export class Submission {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column({ name: 'profile_id', type: 'uuid' })
    profileId: string

    @Column({ name: 'exercise_id', type: 'uuid' })
    exerciseId: string

    @Column({ name: 'selected_answers', type: 'text', array: true })
    selectedAnswers: string[]

    @Column({ name: 'is_correct', type: 'boolean' })
    isCorrect: boolean

    @Column({ type: 'int' })
    point: number

    @ManyToOne(() => Exercise)
    @JoinColumn({ name: 'exercise_id' })
    exercise: Exercise

    @CreateDateColumn({
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP',
        name: 'created_at',
    })
    createdAt: Date

    @UpdateDateColumn({
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP',
        onUpdate: 'CURRENT_TIMESTAMP',
        name: 'updated_at',
    })
    updatedAt: Date
} 