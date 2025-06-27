import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ExercisesController } from './exercises.controller'
import { ExercisesService } from './exercises.service'
import { Exercise } from './exercises.entity'
import { GroupExercisesController } from './group-exercises.controller'
import { GroupExercisesService } from './group-exercises.service'
import { GroupExercise } from './group-exercise.entity'

@Module({
    imports: [TypeOrmModule.forFeature([Exercise, GroupExercise])],
    controllers: [ExercisesController, GroupExercisesController],
    providers: [ExercisesService, GroupExercisesService],
    exports: [ExercisesService, GroupExercisesService],
})
export class ExercisesModule { } 