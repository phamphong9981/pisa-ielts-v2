import {
    Body,
    Controller,
    Get,
    Param,
    Post,
    Request,
    UseGuards,
    UseInterceptors,
} from '@nestjs/common'
import { ClassService } from './class.service'
import { CreateClassDto } from './dto/create-class.dto'
import { Class } from './class.entity'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { TransformInterceptor } from '../interceptors/transform.interceptor'

@UseInterceptors(TransformInterceptor)
@Controller('classes')
export class ClassController {
    constructor(private readonly classService: ClassService) { }

    @Post()
    async createClass(@Body() createClassDto: CreateClassDto): Promise<Class> {
        console.log(createClassDto);
        return await this.classService.createClass(createClassDto)
    }

    @Get(':id')
    async getClass(@Param('id') id: string): Promise<any> {
        return await this.classService.getClassById(id)
    }

    @Get()
    async listClasses(): Promise<Class[]> {
        return await this.classService.listClasses()
    }

    @Post(':id/register')
    @UseGuards(JwtAuthGuard)
    async registerClass(
        @Param('id') id: string,
        @Request() req: any,
    ): Promise<any> {
        const username = req.user.username
        return await this.classService.registerForClass(id, username)
    }
} 