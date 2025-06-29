import {
    Column,
    CreateDateColumn,
    Entity,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm'
import { Class } from './class.entity'

export enum TeacherSkill {
    READING = 'reading',
    WRITING = 'writing',
    SPEAKING = 'speaking',
    LISTENING = 'listening',
}

@Entity({ name: 'teachers' })
export class Teacher {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column({ type: 'varchar', length: 255 })
    name: string

    @Column({ type: 'text', array: true, default: [] })
    skills: TeacherSkill[]

    @Column({
        type: 'int',
        array: true,
        default: [],
        name: 'registered_busy_schedule'
    })
    registeredBusySchedule: number[]

    @OneToMany(() => Class, (classEntity) => classEntity.teacherId)
    classes: Class[]

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