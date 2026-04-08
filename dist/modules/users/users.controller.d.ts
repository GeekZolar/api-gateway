import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserStatusDto } from './dto/user-status.dto';
import { UserQueryDto } from './dto/user-query.dto';
import { ChangePasswordDto } from '../auth/dto/change-password.dto';
import { RequestWithUser } from '../../common/interfaces/request-with-user.interface';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    create(dto: CreateUserDto, req: RequestWithUser): Promise<{
        userId: string;
        username: string;
        email: string;
        firstName: string;
        lastName: string;
        isActive: boolean;
        isApproved: boolean;
        isDefaultPassword: boolean;
        message: string;
    }>;
    approve(userId: string, approvedBy: string, req: RequestWithUser): Promise<{
        userId: string;
        isApproved: boolean;
        isActive: boolean;
        approvedBy: string;
        approvedDate: Date;
    }>;
    update(userId: string, dto: UpdateUserDto, user: RequestWithUser['user'], req: RequestWithUser): Promise<{
        userId: string;
        username: string;
        email: string;
        firstName: string;
        lastName: string;
        role: import("../roles/entities/role.entity").Role;
        updatedDate: Date;
    }>;
    setStatus(userId: string, dto: UserStatusDto, updatedBy: string, req: RequestWithUser): Promise<{
        userId: string;
        isActive: boolean;
        message: string;
    }>;
    findAll(query: UserQueryDto): Promise<{
        data: {
            userId: string;
            username: string;
            email: string;
            firstName: string;
            lastName: string;
            role: import("../roles/entities/role.entity").Role;
            isActive: boolean;
            isApproved: boolean;
            lastLoginDate: Date | null;
            createdDate: Date;
        }[];
        meta: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    findOne(userId: string): Promise<{
        userId: string;
        username: string;
        email: string;
        firstName: string;
        lastName: string;
        role: import("../roles/entities/role.entity").Role;
        updatedDate: Date;
    }>;
    changePassword(userId: string, dto: ChangePasswordDto, req: RequestWithUser): Promise<{
        message: string;
    }>;
}
