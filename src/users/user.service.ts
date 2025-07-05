import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import * as bcrypt from 'bcrypt'
import { Repository } from 'typeorm'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateFcmTokenDto } from './dto/update-fcm-token.dto'
import { ListUsersQueryDto, ListUsersResponseDto, UserWithProfileResponseDto } from './dto/list-users.dto'
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

  async getUsers(queryDto: ListUsersQueryDto): Promise<ListUsersResponseDto> {
    const { search, type, page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc' } = queryDto

    // Build query
    const queryBuilder = this.userRepository.createQueryBuilder('user')
      .leftJoinAndSelect('user.profile', 'profile')

    // Search filter
    if (search) {
      queryBuilder.where(
        '(user.username ILIKE :search OR profile.phone ILIKE :search OR profile.email ILIKE :search)',
        { search: `%${search}%` }
      )
    }

    // Type filter
    if (type) {
      const condition = search ? 'AND' : 'WHERE'
      queryBuilder[condition]('user.type = :type', { type })
    }

    // Sorting
    const allowedSortFields = ['createdAt', 'updatedAt', 'username', 'type']
    const sortField = allowedSortFields.includes(sortBy) ? `user.${sortBy}` : 'user.createdAt'
    queryBuilder.orderBy(sortField, sortOrder.toUpperCase() as 'ASC' | 'DESC')

    // Add secondary sort by username for consistency
    if (sortBy !== 'username') {
      queryBuilder.addOrderBy('user.username', 'ASC')
    }

    // Pagination
    const skip = (page - 1) * limit
    queryBuilder.skip(skip).take(limit)

    // Execute query
    const [users, total] = await queryBuilder.getManyAndCount()

    // Transform to response DTO
    const userDtos: UserWithProfileResponseDto[] = users.map(user => ({
      id: user.id,
      username: user.username,
      type: user.type,
      fcmToken: user.fcmToken,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      profile: {
        id: user.profile?.id,
        fullname: user.profile?.fullname,
        email: user.profile?.email,
        phone: user.profile?.phone,
        image: user.profile?.image,
        ieltsPoint: user.profile?.ieltsPoint,
        createdAt: user.profile?.createdAt,
        updatedAt: user.profile?.updatedAt,
      }
    }))

    // Calculate pagination
    const totalPages = Math.ceil(total / limit)
    const hasNext = page < totalPages
    const hasPrev = page > 1

    return {
      users: userDtos,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext,
        hasPrev,
      }
    }
  }
}
