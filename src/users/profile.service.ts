import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { UpdateProfileImageDto } from './dto/update-profile-image.dto'
import { Profile } from './profile.entity'

@Injectable()
export class ProfileService {
    constructor(
        @InjectRepository(Profile)
        private readonly profileRepository: Repository<Profile>) {
    }

    async updateProfileImage(userId: string, imageDto: UpdateProfileImageDto): Promise<Profile> {
        const profile = await this.profileRepository.findOneBy({ userId })

        if (!profile) {
            throw new NotFoundException('Profile not found')
        }

        profile.image = imageDto.image
        return this.profileRepository.save(profile)
    }
}
