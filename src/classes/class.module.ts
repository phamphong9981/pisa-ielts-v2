import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ClassController } from './class.controller'
import { ClassService } from './class.service'
import { Class } from './class.entity'
import { ProfileLessonClass } from './profile-lesson-class.entity'

@Module({
    imports: [TypeOrmModule.forFeature([Class, ProfileLessonClass])],
    controllers: [ClassController],
    providers: [ClassService],
    exports: [ClassService],
})
export class ClassModule { } 