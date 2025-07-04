import { Injectable, UnauthorizedException } from '@nestjs/common'
import { UserService } from '../users/user.service'
import { User } from '../users/user.entity'
import * as bcrypt from 'bcrypt'
import { JwtService } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) { }

  async validateUser(username: string, password: string): Promise<User> {
    const user = await this.userService.findByUsername(username)
    if (!user) {
      throw new UnauthorizedException('Username or password is incorrect')
    }
    const compareResult = await bcrypt.compare(password, user.passwordHash)

    if (!compareResult) {
      throw new UnauthorizedException('Username or password is incorrect')
    }

    return user
  }

  async login(username: string, password: string, fcmToken: string): Promise<{ accessToken: string }> {
    const user = await this.validateUser(username, password)
    user.fcmToken = fcmToken
    await this.userService.updateFcmToken(username, { fcmToken })
    return this.generateJwtToken(user)
  }

  private async generateJwtToken(user: User): Promise<{ accessToken: string }> {
    const payload = {
      username: user.username,
      sub: user.id,
      type: user.type, // Include user type in JWT payload
    }

    return {
      accessToken: await this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('JWT_SECRET_KEY'),
        expiresIn: this.configService.get<string>('JWT_EXPIRES_IN'),
      }),
    }
  }
}
