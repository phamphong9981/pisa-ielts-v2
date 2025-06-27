import {
    Column,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
    ManyToOne,
    JoinColumn,
    OneToMany,
} from 'typeorm'

export enum ClassType {
    FT_LISTENING = 'FT_listening',
    FT_SPEAKING = 'FT_speaking',
    FT_WRITING = 'FT_writing',
    FT_READING = 'FT_reading',
    LISTENING = 'listening',
    SPEAKING = 'speaking',
    WRITING = 'writing',
    READING = 'reading',
}

@Entity({ name: 'class' })
export class Class {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column()
    name: string

    @Column({ name: 'total_student', default: 0 })
    totalStudent: number

    @Column({ name: 'total_lesson_per_week', default: 0 })
    totalLessonPerWeek: number

    @Column({
        type: 'enum',
        enum: ClassType,
        name: 'class_type',
    })
    classType: ClassType

    @Column({ name: 'teacher_id' })
    teacherId: string

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