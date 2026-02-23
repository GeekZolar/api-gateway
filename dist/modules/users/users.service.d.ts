import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserQueryDto } from './dto/user-query.dto';
import { PasswordService } from '../auth/services/password.service';
import { AuditService } from '../audit/audit.service';
import { SessionsService } from '../sessions/sessions.service';
import { RolesService } from '../roles/roles.service';
export declare class UsersService {
    private userRepo;
    private passwordService;
    private auditService;
    private sessionsService;
    private rolesService;
    constructor(userRepo: Repository<User>, passwordService: PasswordService, auditService: AuditService, sessionsService: SessionsService, rolesService: RolesService);
    create(dto: CreateUserDto, createdBy?: string, ipAddress?: string, userAgent?: string): Promise<{
        userId: string;
        username: string;
        email: string;
        firstName: string;
        lastName: string;
        isActive: boolean;
        isApproved: boolean;
        message: string;
    }>;
    approve(userId: string, approvedBy: string, ipAddress?: string, userAgent?: string): Promise<{
        userId: string;
        isApproved: boolean;
        isActive: boolean;
        approvedBy: string;
        approvedDate: Date;
    }>;
    update(userId: string, dto: UpdateUserDto, updatedBy: string, isAdmin: boolean, ipAddress?: string, userAgent?: string): Promise<{
        userId: string;
        username: string;
        email: string;
        firstName: string;
        lastName: string;
        role: import("../roles/entities/role.entity").Role;
        updatedDate: Date;
    }>;
    setStatus(userId: string, isActive: boolean, updatedBy: string, ipAddress?: string, userAgent?: string): Promise<{
        userId: string;
        isActive: boolean;
        message: string;
    }>;
    findPaginated(query: UserQueryDto): Promise<{
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
    changePassword(userId: string, currentPassword: string, newPassword: string, confirmPassword: string, ipAddress?: string, userAgent?: string): Promise<{
        message: string;
    }>;
    private toResponse;
}
