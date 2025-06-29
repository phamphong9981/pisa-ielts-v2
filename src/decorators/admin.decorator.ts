import { applyDecorators, UseGuards } from '@nestjs/common';
import { AdminGuard } from '../auth/guards/admin.guard';

/**
 * Decorator to protect routes with admin access only
 * Combines JWT authentication + admin role checking
 */
export function Admin() {
    return applyDecorators(
        UseGuards(AdminGuard)
    );
} 