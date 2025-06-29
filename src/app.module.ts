import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { UserHttpModule } from './users/user-http.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { ClassModule } from './classes/class.module';
import { ExercisesModule } from './exercises/exercises.module';
import { ScheduleModule } from './schedule/schedule.module';
import { NotificationModule } from './notification/notification.module';

@Module({
  imports: [DatabaseModule, UserHttpModule, ConfigModule.forRoot({
    isGlobal: true,
  }), AuthModule, ClassModule, ExercisesModule, ScheduleModule, NotificationModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
