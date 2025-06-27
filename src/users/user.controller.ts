import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Put,
  Request,
  UseGuards,
  UseInterceptors
} from '@nestjs/common'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { TransformInterceptor } from '../interceptors/transform.interceptor'
import { UpdateProfileImageDto } from './dto/update-profile-image.dto'
import { Profile } from './profile.entity'
import { ProfileService } from './profile.service'
import { User } from './user.entity'
import { UserService } from './user.service'

@UseInterceptors(ClassSerializerInterceptor, TransformInterceptor)
@Controller('/user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly profileService: ProfileService,
  ) { }

  // @Post('register')
  // async register(@Body() userData: CreateUserDto): Promise<User> {
  //   return this.userService.register(userData)
  // }

  // @Post('login')
  // async login(
  //   @Body() credentials: LoginCredentialsDto,
  // ): Promise<TokenResponseDto> {
  //   const { accessToken } = await this.authService.login(
  //     credentials.username,
  //     credentials.password,
  //   )
  //   return { token: accessToken }
  // }

  @Get('/profile')
  @UseGuards(JwtAuthGuard)
  async getProfile(@Request() req): Promise<User> {
    const username = req.user.username
    const user = await this.userService.getUserWithProfile(username)

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND)
    }
    return user
  }

  @Put('profile/image')
  @UseGuards(JwtAuthGuard)
  async updateProfileImage(
    @Request() req,
    @Body() imageRequest: UpdateProfileImageDto,
  ): Promise<Profile> {
    const dbUser = await this.userService.findByUsername(req.user.username)
    if (!dbUser) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND)
    }

    return this.profileService.updateProfileImage(dbUser.id, imageRequest)
  }
}
