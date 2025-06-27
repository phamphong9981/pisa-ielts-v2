import { Module } from '@nestjs/common'
import { UserModule } from './user.module'
import { UserService } from './user.service'
import { UserController } from './user.controller'
import { ConfigModule } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'
import { ProfileService } from './profile.service'
import { AuthModule } from '../auth/auth.module'

@Module({
  imports: [
    UserModule,
    ConfigModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'your-secret-key',
      signOptions: { expiresIn: '24h' },
    }),
    // AuthModule,
  ],
  providers: [UserService, ProfileService],
  exports: [UserService, ProfileService],
  controllers: [UserController],
})
export class UserHttpModule {
}
