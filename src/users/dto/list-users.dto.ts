import { IsOptional, IsString, IsNumber, IsEnum, Min, Max } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { UserType } from '../user.entity';

export class ListUsersQueryDto {
    @IsOptional()
    @IsString()
    search?: string; // Search pattern cho username, fullname, email

    @IsOptional()
    @IsEnum(UserType)
    type?: UserType; // Filter theo user type

    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    @Min(1)
    page?: number = 1; // Page number

    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    @Min(1)
    @Max(100)
    limit?: number = 10; // Items per page

    @IsOptional()
    @IsString()
    sortBy?: string = 'createdAt'; // Sort field

    @IsOptional()
    @IsString()
    @Transform(({ value }) => value?.toLowerCase())
    sortOrder?: 'asc' | 'desc' = 'desc'; // Sort order
}

export class UserWithProfileResponseDto {
    id: string;
    username: string;
    type: UserType;
    fcmToken?: string;
    createdAt: Date;
    updatedAt: Date;
    profile: {
        id: string;
        fullname: string;
        email: string;
        phone: string;
        image: string;
        ieltsPoint: string;
        createdAt: Date;
        updatedAt: Date;
    };
}

export class ListUsersResponseDto {
    users: UserWithProfileResponseDto[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
        hasNext: boolean;
        hasPrev: boolean;
    };
} 