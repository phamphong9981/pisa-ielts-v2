import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Put,
  Query,
  Request,
  UseGuards,
  UseInterceptors
} from '@nestjs/common'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { TransformInterceptor } from '../interceptors/transform.interceptor'
import { ListUsersQueryDto, ListUsersResponseDto } from './dto/list-users.dto'
import { UpdateFcmTokenDto } from './dto/update-fcm-token.dto'
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

  @Get()
  // @AdminOnly()
  async getUsers(@Query() queryDto: ListUsersQueryDto): Promise<ListUsersResponseDto> {
    return this.userService.getUsers(queryDto)
  }

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

  @Put('fcm-token')
  @UseGuards(JwtAuthGuard)
  async updateFcmToken(
    @Request() req,
    @Body() updateFcmTokenDto: UpdateFcmTokenDto,
  ): Promise<{ message: string }> {
    const username = req.user.username
    await this.userService.updateFcmToken(username, updateFcmTokenDto)
    return { message: 'FCM token updated successfully' }
  }

  @Delete('fcm-token')
  @UseGuards(JwtAuthGuard)
  async clearFcmToken(
    @Request() req,
  ): Promise<{ message: string }> {
    const username = req.user.username
    await this.userService.clearFcmToken(username)
    return { message: 'FCM token cleared successfully' }
  }
}
