// src/database/database.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      // Phải import ConfigModule ở đây để `useFactory` có thể inject ConfigService
      imports: [ConfigModule],
      // Tiêm (inject) ConfigService vào factory
      inject: [ConfigService],
      // `useFactory` là một hàm sẽ chỉ chạy sau khi các service trong `inject` đã sẵn sàng
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DATABASE_HOST'),
        port: configService.get<number>('DATABASE_PORT'),
        username: configService.get<string>('DATABASE_USERNAME'),
        password: configService.get<string>('DATABASE_PASSWORD'),
        database: configService.get<string>('DATABASE_DB_NAME'),
        entities: [__dirname + '/../**/*.entity{.ts,.js}'],
        synchronize: false,
      }),
    }),
  ],
  exports: [TypeOrmModule],
})
export class DatabaseModule { }