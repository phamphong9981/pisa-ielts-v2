import {
    Column,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm'

@Entity({ name: 'profile_lesson_class' })
export class ProfileLessonClass {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column({ name: 'profile_id' })
    profileId: string

    @Column({ name: 'class_id' })
    classId: string

    @Column()
    lesson: number

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