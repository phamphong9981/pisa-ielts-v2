import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import * as bcrypt from 'bcrypt'
import { Repository } from 'typeorm'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateFcmTokenDto } from './dto/update-fcm-token.dto'
import { Profile } from './profile.entity'
import { User } from './user.entity'

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Profile)
    private readonly profileRepository: Repository<Profile>,
  ) {
  }

  async register(userData: CreateUserDto): Promise<User> {
    return this.userRepository.manager.transaction(async (manager) => {
      const { username, password, fullname, email, phone } = userData

      const existingUser = await manager.findOneBy(User, { username })
      if (existingUser) {
        throw new HttpException('Username already exists', HttpStatus.BAD_REQUEST)
      }

      const saltRounds = 12
      const passwordHash = await bcrypt.hash(password, saltRounds)

      const user = this.userRepository.create({
        username,
        passwordHash,
      })
      const savedUser = await manager.save(user)

      const profile = this.profileRepository.create({
        user: savedUser,
        fullname,
        email,
        phone,
        image: '',
        ieltsPoint: '',
      })
      await manager.save(profile)

      return savedUser
    })
  }

  async findByUsername(username: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { username } })
  }

  async getUserWithProfile(username: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { username },
      relations: ['profile'],
    })
  }

  async updateFcmToken(username: string, updateFcmTokenDto: UpdateFcmTokenDto): Promise<User> {
    const user = await this.findByUsername(username)
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND)
    }

    user.fcmToken = updateFcmTokenDto.fcmToken
    return this.userRepository.save(user)
  }

  async clearFcmToken(username: string): Promise<User> {
    const user = await this.findByUsername(username)
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND)
    }

    user.fcmToken = null
    return this.userRepository.save(user)
  }
}
