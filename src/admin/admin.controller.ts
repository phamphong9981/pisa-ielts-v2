import { Controller, Get, UseInterceptors } from '@nestjs/common';
import { TransformInterceptor } from '../interceptors/transform.interceptor';
import { AdminOnly, AdminOrTeacher, Roles } from '../decorators/roles.decorator';
import { Admin } from '../decorators/admin.decorator';
import { UserType } from '../users/user.entity';
import { AuthUser } from '../decorators/auth.user.decorator';

@UseInterceptors(TransformInterceptor)
@Controller('admin')
export class AdminController {

    // Using the simple Admin decorator
    @Get('dashboard')
    @Admin()
    async getDashboard(@AuthUser() user: any) {
        return {
            message: 'Welcome to admin dashboard',
            user: {
                id: user.id,
                username: user.username,
                type: user.type
            }
        };
    }

    // Using the AdminOnly decorator from roles
    @Get('users')
    @AdminOnly()
    async getAllUsers() {
        return {
            message: 'List of all users - Admin only access',
            users: []
        };
    }

    // Using generic Roles decorator for multiple roles
    @Get('classes')
    @AdminOrTeacher()
    async getClasses(@AuthUser() user: any) {
        return {
            message: 'Classes management - Admin or Teacher access',
            userType: user.type
        };
    }

    // Using Roles decorator with custom role combination
    @Get('reports')
    @Roles(UserType.ADMIN)
    async getReports() {
        return {
            message: 'System reports - Admin only',
            reports: []
        };
    }
} 