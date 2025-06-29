import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ClassController } from './class.controller'
import { ClassService } from './class.service'
import { Class } from './class.entity'
import { ProfileLessonClass } from './profile-lesson-class.entity'
import { TeacherController } from './teacher.controller'
import { TeacherService } from './teacher.service'
import { Teacher } from './teacher.entity'

@Module({
    imports: [TypeOrmModule.forFeature([Class, ProfileLessonClass, Teacher])],
    controllers: [ClassController, TeacherController],
    providers: [ClassService, TeacherService],
    exports: [ClassService, TeacherService],
})
export class ClassModule { } 