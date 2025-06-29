import { SetMetadata, applyDecorators, UseGuards } from '@nestjs/common';
import { RoleGuard, ROLES_KEY } from '../auth/guards/role.guard';
import { UserType } from '../users/user.entity';

/**
 * Decorator to set required roles for a route
 * @param roles - Array of UserType roles required to access the route
 */
export const Roles = (...roles: UserType[]) =>
    applyDecorators(
        SetMetadata(ROLES_KEY, roles),
        UseGuards(RoleGuard)
    );

/**
 * Shorthand decorator for admin-only access
 */
export const AdminOnly = () => Roles(UserType.ADMIN);

/**
 * Shorthand decorator for teacher-only access  
 */
export const TeacherOnly = () => Roles(UserType.TEACHER);

/**
 * Shorthand decorator for admin or teacher access
 */
export const AdminOrTeacher = () => Roles(UserType.ADMIN, UserType.TEACHER); 