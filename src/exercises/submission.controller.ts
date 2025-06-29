import {
    Body,
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    Param,
    ParseUUIDPipe,
    Post,
    Request,
    UseGuards,
    UseInterceptors,
    ValidationPipe,
} from '@nestjs/common'
import { TransformInterceptor } from 'src/interceptors/transform.interceptor'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { CreateSubmissionsDto } from './dto/create-submissions.dto'
import { SubmissionService } from './submission.service'
import { CreateSubmissionDto } from './dto/create-submission.dto'

@UseInterceptors(TransformInterceptor)
@Controller()
export class SubmissionController {
    constructor(private readonly submissionService: SubmissionService) { }

    @Post('submissions')
    @UseGuards(JwtAuthGuard)
    @HttpCode(HttpStatus.OK)
    async createSubmissions(
        @Request() req,
        @Body(ValidationPipe) createSubmissionsDto: CreateSubmissionsDto,
    ) {
        const username = req.user.username
        return this.submissionService.createSubmissions(username, createSubmissionsDto)
    }

    @Get('submissions/:profile_id')
    async getSubmissionsByProfile(
        @Param('profile_id', ParseUUIDPipe) profileId: string,
    ) {
        return this.submissionService.getSubmissionsByProfile(profileId)
    }
} 