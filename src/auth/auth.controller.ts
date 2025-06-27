import { Body, ClassSerializerInterceptor, Controller, Post, UseInterceptors } from '@nestjs/common'
import { TransformInterceptor } from 'src/interceptors/transform.interceptor'
import { CreateUserDto } from 'src/users/dto/create-user.dto'
import { LoginCredentialsDto } from 'src/users/dto/login-credentials.dto'
import { TokenResponseDto } from 'src/users/dto/token-response.dto'
import { User } from '../users/user.entity'
import { UserService } from '../users/user.service'
import { AuthService } from './auth.service'

@UseInterceptors(ClassSerializerInterceptor, TransformInterceptor)
@Controller('/')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {
  }

  @Post('register')
  async register(@Body() userData: CreateUserDto): Promise<User> {
    return this.userService.register(userData)
  }

  @Post('login')
  async login(
    @Body() credentials: LoginCredentialsDto,
  ): Promise<TokenResponseDto> {
    const { accessToken } = await this.authService.login(
      credentials.username,
      credentials.password,
    )
    return { token: accessToken }
  }
}
