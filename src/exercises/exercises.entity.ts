import {
    Column,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm'

export enum QuestionType {
    READING = 'reading',
    LISTENING = 'listening',
    WRITING = 'writing',
    SPEAKING = 'speaking',
    OTHER = 'other',
}

export enum AnswerType {
    SINGLE_CHOICE = 'single_choice',
    MULTIPLE_CHOICE = 'multiple_choice',
}

@Entity({ name: 'exercises' })
export class Exercise {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column({ type: 'text' })
    question: string

    @Column({ type: 'text', array: true })
    answer: string[]

    @Column({
        type: 'enum',
        enum: QuestionType,
        name: 'question_type',
    })
    questionType: QuestionType

    @Column({
        type: 'enum',
        enum: AnswerType,
        name: 'answer_type',
    })
    answerType: AnswerType

    @Column({ type: 'text', array: true, nullable: true, name: 'correct_answer' })
    correctAnswer: string[]

    @Column({ type: 'int', default: 1 })
    point: number

    @Column({ type: 'uuid', nullable: true, name: 'group_id' })
    groupId: string | null

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