import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { UserHttpModule } from './users/user-http.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [DatabaseModule, UserHttpModule, ConfigModule.forRoot({
    isGlobal: true,
  }), AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
