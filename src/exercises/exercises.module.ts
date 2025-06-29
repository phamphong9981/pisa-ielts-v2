import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ExercisesController } from './exercises.controller'
import { ExercisesService } from './exercises.service'
import { Exercise } from './exercises.entity'
import { GroupExercisesController } from './group-exercises.controller'
import { GroupExercisesService } from './group-exercises.service'
import { GroupExercise } from './group-exercise.entity'
import { SubmissionController } from './submission.controller'
import { SubmissionService } from './submission.service'
import { Submission } from './submission.entity'

@Module({
    imports: [TypeOrmModule.forFeature([Exercise, GroupExercise, Submission])],
    controllers: [ExercisesController, GroupExercisesController, SubmissionController],
    providers: [ExercisesService, GroupExercisesService, SubmissionService],
    exports: [ExercisesService, GroupExercisesService, SubmissionService],
})
export class ExercisesModule { } 