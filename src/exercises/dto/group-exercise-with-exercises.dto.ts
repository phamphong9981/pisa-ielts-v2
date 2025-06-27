import { Exercise } from '../exercises.entity'

export class GroupExerciseWithExercisesDto {
    id: string
    content: string
    exercises: Exercise[]
    createdAt: Date
    updatedAt: Date
} 