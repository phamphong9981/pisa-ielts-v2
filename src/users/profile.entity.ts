import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    OneToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity({ name: 'profiles' })
export class Profile {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ name: 'user_id' })
    userId: string;

    @OneToOne(() => User, (user) => user.profile)
    @JoinColumn({ name: 'user_id' })
    user: User;

    @Column({ name: 'fullname' })
    fullname: string;

    @Column({ name: 'email' })
    email: string;

    @Column({ name: 'image' })
    image: string;

    @Column({ name: 'phone' })
    phone: string;

    @Column({ name: 'ielts_point' })
    ieltsPoint: string;

    @CreateDateColumn({
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP',
        name: 'created_at',
    })
    createdAt: Date;

    @UpdateDateColumn({
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP',
        onUpdate: 'CURRENT_TIMESTAMP',
        name: 'updated_at',
    })
    updatedAt: Date;
}