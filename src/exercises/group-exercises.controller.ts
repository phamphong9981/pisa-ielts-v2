import {
    Controller,
    Get,
    Post,
    Put,
    Delete,
    Body,
    Param,
    HttpCode,
    HttpStatus,
    ValidationPipe,
    ParseUUIDPipe,
} from '@nestjs/common'
import { GroupExercisesService } from './group-exercises.service'
import { CreateGroupExerciseDto } from './dto/create-group-exercise.dto'
import { UpdateGroupExerciseDto } from './dto/update-group-exercise.dto'

interface ApiResponse<T> {
    data: T
    error: string | null
}

@Controller()
export class GroupExercisesController {
    constructor(private readonly groupExercisesService: GroupExercisesService) { }

    @Post('group-exercises')
    @HttpCode(HttpStatus.OK)
    async createGroupExercise(
        @Body(ValidationPipe) createGroupExerciseDto: CreateGroupExerciseDto,
    ): Promise<ApiResponse<any>> {
        try {
            const groupExercise = await this.groupExercisesService.createGroupExercise(createGroupExerciseDto)
            return {
                data: groupExercise,
                error: null,
            }
        } catch (error) {
            console.error('Failed to create group exercise:', error)
            return {
                data: null,
                error: 'Failed to create group exercise',
            }
        }
    }

    @Get('group-exercises/:id')
    async getGroupExercise(
        @Param('id', ParseUUIDPipe) id: string,
    ): Promise<ApiResponse<any>> {
        try {
            const groupExercise = await this.groupExercisesService.findOne(id)
            return {
                data: groupExercise,
                error: null,
            }
        } catch (error) {
            if (error.message === 'Group exercise not found') {
                return {
                    data: null,
                    error: 'Group exercise not found',
                }
            }
            console.error('Database error:', error)
            return {
                data: null,
                error: 'Failed to fetch group exercise',
            }
        }
    }

    @Get('group-exercises')
    async listGroupExercises(): Promise<ApiResponse<any[]>> {
        try {
            const groupExercises = await this.groupExercisesService.findAll()
            return {
                data: groupExercises,
                error: null,
            }
        } catch (error) {
            console.error('Database error:', error)
            return {
                data: null,
                error: 'Failed to fetch group exercises',
            }
        }
    }

    @Put('group-exercises/:id')
    async updateGroupExercise(
        @Param('id', ParseUUIDPipe) id: string,
        @Body(ValidationPipe) updateGroupExerciseDto: UpdateGroupExerciseDto,
    ): Promise<ApiResponse<any>> {
        try {
            const groupExercise = await this.groupExercisesService.update(id, updateGroupExerciseDto)
            return {
                data: groupExercise,
                error: null,
            }
        } catch (error) {
            if (error.message === 'Group exercise not found') {
                return {
                    data: null,
                    error: 'Group exercise not found',
                }
            }
            console.error('Database error:', error)
            return {
                data: null,
                error: 'Failed to update group exercise',
            }
        }
    }

    @Delete('group-exercises/:id')
    async deleteGroupExercise(
        @Param('id', ParseUUIDPipe) id: string,
    ): Promise<ApiResponse<string>> {
        try {
            const result = await this.groupExercisesService.remove(id)
            return {
                data: result.message,
                error: null,
            }
        } catch (error) {
            if (error.message === 'Group exercise not found') {
                return {
                    data: null,
                    error: 'Group exercise not found',
                }
            }
            console.error('Database error:', error)
            return {
                data: null,
                error: 'Failed to delete group exercise',
            }
        }
    }
}
