import { Module } from '@nestjs/common'
import { AuthService } from './auth.service'
// import { AuthController } from './auth.controller'
import { UserHttpModule } from '../users/user-http.module'
import { PassportModule } from '@nestjs/passport'
// import { LocalStrategy } from './strategies/local.strategy'
import { JwtModule } from '@nestjs/jwt'
// import { JwtStrategy } from './strategies/jwt.strategy'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { JwtStrategy } from './strategies/jwt.strategy'
import { AuthController } from './auth.controller'

@Module({
  imports: [
    UserHttpModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET_KEY'),
        signOptions: { expiresIn: configService.get<string>('JWT_EXPIRES_IN') },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController],
})
export class AuthModule {
}
