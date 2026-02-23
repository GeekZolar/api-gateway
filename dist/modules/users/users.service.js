"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("./entities/user.entity");
const password_service_1 = require("../auth/services/password.service");
const audit_service_1 = require("../audit/audit.service");
const sessions_service_1 = require("../sessions/sessions.service");
const roles_service_1 = require("../roles/roles.service");
let UsersService = class UsersService {
    constructor(userRepo, passwordService, auditService, sessionsService, rolesService) {
        this.userRepo = userRepo;
        this.passwordService = passwordService;
        this.auditService = auditService;
        this.sessionsService = sessionsService;
        this.rolesService = rolesService;
    }
    async create(dto, createdBy, ipAddress, userAgent) {
        const existingUsername = await this.userRepo.findOne({ where: { username: dto.username } });
        if (existingUsername)
            throw new common_1.ConflictException('Username already exists');
        const existingEmail = await this.userRepo.findOne({ where: { email: dto.email } });
        if (existingEmail)
            throw new common_1.ConflictException('Email already exists');
        const roleExists = await this.rolesService.validateRoleId(dto.roleId);
        if (!roleExists)
            throw new common_1.BadRequestException('Invalid role');
        const validation = this.passwordService.validateStrength(dto.password);
        if (!validation.valid)
            throw new common_1.BadRequestException(validation.message);
        const passwordHash = await this.passwordService.hash(dto.password);
        const user = this.userRepo.create({
            username: dto.username,
            email: dto.email,
            passwordHash,
            firstName: dto.firstName,
            lastName: dto.lastName,
            roleId: dto.roleId,
            isActive: false,
            isApproved: false,
            createdBy: createdBy || null,
        });
        const saved = await this.userRepo.save(user);
        await this.auditService.log({
            userId: createdBy,
            action: 'USER_CREATE',
            entityType: 'User',
            entityId: saved.userId,
            newValues: { username: saved.username, email: saved.email },
            ipAddress,
            userAgent,
            status: 'SUCCESS',
        });
        return {
            userId: saved.userId,
            username: saved.username,
            email: saved.email,
            firstName: saved.firstName,
            lastName: saved.lastName,
            isActive: saved.isActive,
            isApproved: saved.isApproved,
            message: 'User created successfully. Pending approval.',
        };
    }
    async approve(userId, approvedBy, ipAddress, userAgent) {
        const user = await this.userRepo.findOne({ where: { userId }, relations: ['role'] });
        if (!user)
            throw new common_1.NotFoundException('User not found');
        if (user.isApproved)
            throw new common_1.BadRequestException('User already approved');
        user.isApproved = true;
        user.isActive = true;
        user.approvedBy = approvedBy;
        user.approvedDate = new Date();
        await this.userRepo.save(user);
        await this.auditService.log({
            userId: approvedBy,
            action: 'USER_APPROVE',
            entityType: 'User',
            entityId: user.userId,
            newValues: { isApproved: true, isActive: true },
            ipAddress,
            userAgent,
            status: 'SUCCESS',
        });
        return {
            userId: user.userId,
            isApproved: true,
            isActive: true,
            approvedBy,
            approvedDate: user.approvedDate,
        };
    }
    async update(userId, dto, updatedBy, isAdmin, ipAddress, userAgent) {
        const user = await this.userRepo.findOne({ where: { userId }, relations: ['role'] });
        if (!user)
            throw new common_1.NotFoundException('User not found');
        const oldValues = { ...user };
        if (dto.firstName !== undefined)
            user.firstName = dto.firstName;
        if (dto.lastName !== undefined)
            user.lastName = dto.lastName;
        if (dto.email !== undefined) {
            const existing = await this.userRepo.findOne({ where: { email: dto.email } });
            if (existing && existing.userId !== userId)
                throw new common_1.ConflictException('Email already in use');
            user.email = dto.email;
        }
        if (dto.roleId !== undefined) {
            if (!isAdmin)
                throw new common_1.ForbiddenException('Only admins can change roles');
            user.roleId = dto.roleId;
        }
        user.updatedBy = updatedBy;
        await this.userRepo.save(user);
        await this.auditService.log({
            userId: updatedBy,
            action: 'USER_UPDATE',
            entityType: 'User',
            entityId: userId,
            oldValues: { firstName: oldValues.firstName, lastName: oldValues.lastName, email: oldValues.email },
            newValues: dto,
            ipAddress,
            userAgent,
            status: 'SUCCESS',
        });
        return this.toResponse(user);
    }
    async setStatus(userId, isActive, updatedBy, ipAddress, userAgent) {
        const user = await this.userRepo.findOne({ where: { userId }, relations: ['role'] });
        if (!user)
            throw new common_1.NotFoundException('User not found');
        user.isActive = isActive;
        user.updatedBy = updatedBy;
        await this.userRepo.save(user);
        if (!isActive) {
            await this.sessionsService.revokeAllForUser(userId);
        }
        await this.auditService.log({
            userId: updatedBy,
            action: 'USER_STATUS',
            entityType: 'User',
            entityId: userId,
            newValues: { isActive },
            ipAddress,
            userAgent,
            status: 'SUCCESS',
        });
        return {
            userId: user.userId,
            isActive,
            message: 'User status updated successfully',
        };
    }
    async findPaginated(query) {
        const { page = 1, limit = 20, search, role, isActive, sortBy = 'createdDate', sortOrder = 'DESC' } = query;
        const qb = this.userRepo
            .createQueryBuilder('u')
            .leftJoinAndSelect('u.role', 'r')
            .select([
            'u.userId',
            'u.username',
            'u.email',
            'u.firstName',
            'u.lastName',
            'u.isActive',
            'u.isApproved',
            'u.lastLoginDate',
            'u.createdDate',
            'r.roleId',
            'r.roleName',
            'r.permissions',
        ])
            .orderBy(`u.${sortBy}`, sortOrder);
        if (search) {
            qb.andWhere('(u.username ILIKE :search OR u.email ILIKE :search OR u.firstName ILIKE :search OR u.lastName ILIKE :search)', { search: `%${search}%` });
        }
        if (role) {
            qb.andWhere('r.roleName = :role', { role });
        }
        if (typeof isActive === 'boolean') {
            qb.andWhere('u.isActive = :isActive', { isActive });
        }
        const total = await qb.getCount();
        const data = await qb
            .skip((page - 1) * limit)
            .take(Math.min(limit, 100))
            .getMany();
        return {
            data: data.map((u) => ({
                userId: u.userId,
                username: u.username,
                email: u.email,
                firstName: u.firstName,
                lastName: u.lastName,
                role: u.role,
                isActive: u.isActive,
                isApproved: u.isApproved,
                lastLoginDate: u.lastLoginDate,
                createdDate: u.createdDate,
            })),
            meta: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
    async findOne(userId) {
        const user = await this.userRepo.findOne({
            where: { userId },
            relations: ['role'],
        });
        if (!user)
            throw new common_1.NotFoundException('User not found');
        return this.toResponse(user);
    }
    async changePassword(userId, currentPassword, newPassword, confirmPassword, ipAddress, userAgent) {
        if (newPassword !== confirmPassword) {
            throw new common_1.BadRequestException('Passwords do not match');
        }
        const user = await this.userRepo.findOne({ where: { userId } });
        if (!user)
            throw new common_1.NotFoundException('User not found');
        const valid = await this.passwordService.compare(currentPassword, user.passwordHash);
        if (!valid)
            throw new common_1.BadRequestException('Current password is incorrect');
        const validation = this.passwordService.validateStrength(newPassword);
        if (!validation.valid)
            throw new common_1.BadRequestException(validation.message);
        const newHash = await this.passwordService.hash(newPassword);
        const inHistory = await this.passwordService.isInHistory(userId, newHash);
        if (inHistory)
            throw new common_1.BadRequestException('Cannot reuse one of your last 5 passwords');
        await this.passwordService.addToHistory(userId, user.passwordHash);
        user.passwordHash = newHash;
        user.passwordLastChangedDate = new Date();
        await this.userRepo.save(user);
        await this.auditService.log({
            userId,
            action: 'PASSWORD_CHANGE',
            entityType: 'User',
            entityId: userId,
            ipAddress,
            userAgent,
            status: 'SUCCESS',
        });
        return { message: 'Password changed successfully' };
    }
    toResponse(user) {
        return {
            userId: user.userId,
            username: user.username,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role,
            updatedDate: user.updatedDate,
        };
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        password_service_1.PasswordService,
        audit_service_1.AuditService,
        sessions_service_1.SessionsService,
        roles_service_1.RolesService])
], UsersService);
//# sourceMappingURL=users.service.js.map