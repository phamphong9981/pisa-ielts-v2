import {
    Column,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm'

@Entity({ name: 'busy_schedule' })
export class BusySchedule {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column({ name: 'profile_id', type: 'uuid' })
    profileId: string

    @Column({ name: 'week_id', type: 'uuid' })
    weekId: string

    @Column({ name: 'busy_schedule_arr', type: 'integer', array: true })
    busyScheduleArr: number[]

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