import {
    Column,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm'

@Entity({ name: 'schedule' })
export class Schedule {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column({ name: 'profile_lesson_class_id', type: 'uuid' })
    profileLessonClassId: string

    @Column({ name: 'week_id', type: 'uuid' })
    weekId: string

    @Column({ name: 'schedule_time', type: 'integer' })
    scheduleTime: number

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