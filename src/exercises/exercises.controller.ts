import {
    Controller,
    Get,
    Post,
    Put,
    Delete,
    Body,
    Param,
    Query,
    HttpCode,
    HttpStatus,
    ValidationPipe,
    ParseUUIDPipe,
    BadRequestException,
} from '@nestjs/common'
import { ExercisesService } from './exercises.service'
import { CreateExercisesDto } from './dto/create-exercises.dto'
import { UpdateExerciseDto } from './dto/update-exercise.dto'
import { ListExercisesDto } from './dto/list-exercises.dto'

interface ApiResponse<T> {
    data: T
    error: string | null
}

@Controller()
export class ExercisesController {
    constructor(private readonly exercisesService: ExercisesService) { }

    @Post('exercises')
    @HttpCode(HttpStatus.OK)
    async createExercises(
        @Body(ValidationPipe) createExercisesDto: CreateExercisesDto,
    ): Promise<ApiResponse<any[]>> {
        try {
            const exercises = await this.exercisesService.createExercises(createExercisesDto)
            return {
                data: exercises,
                error: null,
            }
        } catch (error) {
            console.error('Database error:', error)
            return {
                data: null,
                error: 'Failed to create exercises',
            }
        }
    }

    @Get('exercise/:id')
    async getExercise(
        @Param('id', ParseUUIDPipe) id: string,
    ): Promise<ApiResponse<any>> {
        try {
            const exercise = await this.exercisesService.findOne(id)
            return {
                data: exercise,
                error: null,
            }
        } catch (error) {
            if (error.message === 'Exercise not found') {
                return {
                    data: null,
                    error: 'Exercise not found',
                }
            }
            console.error('Database error:', error)
            return {
                data: null,
                error: 'Failed to fetch exercise',
            }
        }
    }

    @Get('exercises')
    async listExercises(
        @Query(ValidationPipe) filters: ListExercisesDto,
    ): Promise<ApiResponse<any[]>> {
        try {
            const exercises = await this.exercisesService.findAll(filters)
            return {
                data: exercises,
                error: null,
            }
        } catch (error) {
            console.error('Database error:', error)
            return {
                data: null,
                error: 'Failed to fetch exercises',
            }
        }
    }

    @Put('exercise/:id')
    async updateExercise(
        @Param('id', ParseUUIDPipe) id: string,
        @Body(ValidationPipe) updateExerciseDto: UpdateExerciseDto,
    ): Promise<ApiResponse<any>> {
        try {
            const exercise = await this.exercisesService.update(id, updateExerciseDto)
            return {
                data: exercise,
                error: null,
            }
        } catch (error) {
            if (error.message === 'Exercise not found') {
                return {
                    data: null,
                    error: 'Exercise not found',
                }
            }
            if (error.message === 'No fields to update') {
                return {
                    data: null,
                    error: 'No fields to update',
                }
            }
            console.error('Database error:', error)
            return {
                data: null,
                error: 'Failed to update exercise',
            }
        }
    }

    @Delete('exercise/:id')
    async deleteExercise(
        @Param('id', ParseUUIDPipe) id: string,
    ): Promise<ApiResponse<string>> {
        try {
            const result = await this.exercisesService.remove(id)
            return {
                data: result.message,
                error: null,
            }
        } catch (error) {
            if (error.message === 'Exercise not found') {
                return {
                    data: null,
                    error: 'Exercise not found',
                }
            }
            console.error('Database error:', error)
            return {
                data: null,
                error: 'Failed to delete exercise',
            }
        }
    }
} 