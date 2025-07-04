import { Exclude } from 'class-transformer'
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm'
import { Profile } from './profile.entity'

export enum UserType {
  ADMIN = 'admin',
  USER = 'user',
  TEACHER = 'teacher',
}

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Unique(['username'])
  @Column()
  username: string

  @Exclude()
  @Column({ name: 'password_hash' })
  passwordHash: string

  @Column({
    type: 'enum',
    enum: UserType,
    default: UserType.USER,
    name: 'type',
  })
  type: UserType

  @Column({ name: 'fcm_token', nullable: true })
  fcmToken: string

  @OneToOne(() => Profile, (profile) => profile.user)
  profile: Profile

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
