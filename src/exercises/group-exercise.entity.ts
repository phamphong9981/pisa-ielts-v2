import {
    Column,
    CreateDateColumn,
    Entity,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm'
import { Exercise } from './exercises.entity'

@Entity({ name: 'group_exercises' })
export class GroupExercise {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column({ type: 'text' })
    content: string

    @OneToMany(() => Exercise, (exercise) => exercise.groupId)
    exercises: Exercise[]

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