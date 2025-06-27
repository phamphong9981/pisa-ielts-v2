import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ExercisesController } from './exercises.controller'
import { ExercisesService } from './exercises.service'
import { Exercise } from './exercises.entity'

@Module({
    imports: [TypeOrmModule.forFeature([Exercise])],
    controllers: [ExercisesController],
    providers: [ExercisesService],
    exports: [ExercisesService],
})
export class ExercisesModule { } 