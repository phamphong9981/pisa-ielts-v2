import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Put,
    Request,
    UseGuards,
    UseInterceptors,
} from '@nestjs/common'
import { ClassService } from './class.service'
import { CreateClassDto } from './dto/create-class.dto'
import { Class } from './class.entity'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { TransformInterceptor } from '../interceptors/transform.interceptor'
import { UpdateClassDto } from './dto/update-class.dto'
import { RegisterClassForUserDto } from './dto/register-class-for-user.dto'
import { UnregisterClassForUserDto } from './dto/unregister-class-for-user.dto'

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

    @Put(':id')
    async updateClass(@Param('id') id: string, @Body() updateClassDto: UpdateClassDto): Promise<any> {
        return await this.classService.updateClass(id, updateClassDto)
    }

    @Delete(':id')
    async deleteClass(@Param('id') id: string): Promise<any> {
        return await this.classService.deleteClass(id)
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

    @Post('register-class-for-user')
    async registerClassForUser(@Body() registerClassForUserDto: RegisterClassForUserDto): Promise<any> {
        return this.classService.registerForClass(registerClassForUserDto.classId, registerClassForUserDto.username)
    }

    @Post('unregister-class-for-user')
    async unregisterClassForUser(@Body() unregisterClassForUserDto: UnregisterClassForUserDto): Promise<any> {
        return this.classService.unregisterFromClass(unregisterClassForUserDto.classId, unregisterClassForUserDto.username)
    }
} 