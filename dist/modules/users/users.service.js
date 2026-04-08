"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "UsersService", {
    enumerable: true,
    get: function() {
        return UsersService;
    }
});
const _common = require("@nestjs/common");
const _typeorm = require("@nestjs/typeorm");
const _typeorm1 = require("typeorm");
const _userentity = require("./entities/user.entity");
const _passwordservice = require("../auth/services/password.service");
const _auditservice = require("../audit/audit.service");
const _sessionsservice = require("../sessions/sessions.service");
const _rolesservice = require("../roles/roles.service");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
function _ts_param(paramIndex, decorator) {
    return function(target, key) {
        decorator(target, key, paramIndex);
    };
}
let UsersService = class UsersService {
    async create(dto, createdBy, ipAddress, userAgent) {
        const existingUsername = await this.userRepo.findOne({
            where: {
                username: dto.username
            }
        });
        if (existingUsername) throw new _common.ConflictException('Username already exists');
        const existingEmail = await this.userRepo.findOne({
            where: {
                email: dto.email
            }
        });
        if (existingEmail) throw new _common.ConflictException('Email already exists');
        const roleExists = await this.rolesService.validateRoleId(dto.roleId);
        if (!roleExists) throw new _common.BadRequestException('Invalid role');
        const validation = this.passwordService.validateStrength(dto.password);
        if (!validation.valid) throw new _common.BadRequestException(validation.message);
        const passwordHash = await this.passwordService.hash(dto.password);
        const user = this.userRepo.create({
            username: dto.username,
            email: dto.email,
            passwordHash,
            isDefaultPassword: true,
            firstName: dto.firstName,
            lastName: dto.lastName,
            roleId: dto.roleId,
            isActive: false,
            isApproved: false,
            createdBy: createdBy || null
        });
        const saved = await this.userRepo.save(user);
        await this.auditService.log({
            userId: createdBy,
            action: 'USER_CREATE',
            entityType: 'User',
            entityId: saved.userId,
            newValues: {
                username: saved.username,
                email: saved.email
            },
            ipAddress,
            userAgent,
            status: 'SUCCESS'
        });
        return {
            userId: saved.userId,
            username: saved.username,
            email: saved.email,
            firstName: saved.firstName,
            lastName: saved.lastName,
            isActive: saved.isActive,
            isApproved: saved.isApproved,
            isDefaultPassword: saved.isDefaultPassword,
            message: 'User created successfully. Pending approval.'
        };
    }
    async approve(userId, approvedBy, ipAddress, userAgent) {
        const user = await this.userRepo.findOne({
            where: {
                userId
            },
            relations: [
                'role'
            ]
        });
        if (!user) throw new _common.NotFoundException('User not found');
        if (user.isApproved) throw new _common.BadRequestException('User already approved');
        user.isApproved = true;
        user.isActive = true;
        user.approvedBy = approvedBy;
        user.approvedDate = new Date();
        await this.userRepo.save(user);
        // send email to user with the link to the dashboard and the temporary password
        // const dashboardUrl = `${process.env.DASHBOARD_URL}/login`;
        // const temporaryPassword = user.password;
        // const emailSubject = 'User Approved';
        // const emailBody = `Your account has been approved. Please click the link below to login: ${dashboardUrl}`;
        // await this.emailService.sendEmail(user.email, emailSubject, emailBody, temporaryPassword);
        await this.auditService.log({
            userId: approvedBy,
            action: 'USER_APPROVE',
            entityType: 'User',
            entityId: user.userId,
            newValues: {
                isApproved: true,
                isActive: true
            },
            ipAddress,
            userAgent,
            status: 'SUCCESS'
        });
        return {
            userId: user.userId,
            isApproved: true,
            isActive: true,
            approvedBy,
            approvedDate: user.approvedDate
        };
    }
    async update(userId, dto, updatedBy, isAdmin, ipAddress, userAgent) {
        const user = await this.userRepo.findOne({
            where: {
                userId
            },
            relations: [
                'role'
            ]
        });
        if (!user) throw new _common.NotFoundException('User not found');
        const oldValues = {
            ...user
        };
        if (dto.firstName !== undefined) user.firstName = dto.firstName;
        if (dto.lastName !== undefined) user.lastName = dto.lastName;
        if (dto.email !== undefined) {
            const existing = await this.userRepo.findOne({
                where: {
                    email: dto.email
                }
            });
            if (existing && existing.userId !== userId) throw new _common.ConflictException('Email already in use');
            user.email = dto.email;
        }
        if (dto.roleId !== undefined) {
            if (!isAdmin) throw new _common.ForbiddenException('Only admins can change roles');
            user.roleId = dto.roleId;
        }
        user.updatedBy = updatedBy;
        await this.userRepo.save(user);
        await this.auditService.log({
            userId: updatedBy,
            action: 'USER_UPDATE',
            entityType: 'User',
            entityId: userId,
            oldValues: {
                firstName: oldValues.firstName,
                lastName: oldValues.lastName,
                email: oldValues.email
            },
            newValues: dto,
            ipAddress,
            userAgent,
            status: 'SUCCESS'
        });
        return this.toResponse(user);
    }
    async setStatus(userId, isActive, updatedBy, ipAddress, userAgent) {
        const user = await this.userRepo.findOne({
            where: {
                userId
            },
            relations: [
                'role'
            ]
        });
        if (!user) throw new _common.NotFoundException('User not found');
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
            newValues: {
                isActive
            },
            ipAddress,
            userAgent,
            status: 'SUCCESS'
        });
        return {
            userId: user.userId,
            isActive,
            message: 'User status updated successfully'
        };
    }
    async findPaginated(query) {
        const { page = 1, limit = 20, search, role, isActive, sortBy = 'createdDate', sortOrder = 'DESC' } = query;
        const qb = this.userRepo.createQueryBuilder('u').leftJoinAndSelect('u.role', 'r').select([
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
            'r.permissions'
        ]).orderBy(`u.${sortBy}`, sortOrder);
        if (search) {
            qb.andWhere('(u.username ILIKE :search OR u.email ILIKE :search OR u.firstName ILIKE :search OR u.lastName ILIKE :search)', {
                search: `%${search}%`
            });
        }
        if (role) {
            qb.andWhere('r.roleName = :role', {
                role
            });
        }
        if (typeof isActive === 'boolean') {
            qb.andWhere('u.isActive = :isActive', {
                isActive
            });
        }
        const total = await qb.getCount();
        const data = await qb.skip((page - 1) * limit).take(Math.min(limit, 100)).getMany();
        return {
            data: data.map((u)=>({
                    userId: u.userId,
                    username: u.username,
                    email: u.email,
                    firstName: u.firstName,
                    lastName: u.lastName,
                    role: u.role,
                    isActive: u.isActive,
                    isApproved: u.isApproved,
                    lastLoginDate: u.lastLoginDate,
                    createdDate: u.createdDate
                })),
            meta: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit)
            }
        };
    }
    async findOne(userId) {
        const user = await this.userRepo.findOne({
            where: {
                userId
            },
            relations: [
                'role'
            ]
        });
        if (!user) throw new _common.NotFoundException('User not found');
        return this.toResponse(user);
    }
    async changePassword(userId, currentPassword, newPassword, confirmPassword, ipAddress, userAgent) {
        if (newPassword !== confirmPassword) {
            throw new _common.BadRequestException('Passwords do not match');
        }
        const user = await this.userRepo.findOne({
            where: {
                userId
            }
        });
        if (!user) throw new _common.NotFoundException('User not found');
        const valid = await this.passwordService.compare(currentPassword, user.passwordHash);
        if (!valid) throw new _common.BadRequestException('Current password is incorrect');
        const validation = this.passwordService.validateStrength(newPassword);
        if (!validation.valid) throw new _common.BadRequestException(validation.message);
        const newHash = await this.passwordService.hash(newPassword);
        const inHistory = await this.passwordService.isInHistory(userId, newHash);
        if (inHistory) throw new _common.BadRequestException('Cannot reuse one of your last 5 passwords');
        await this.passwordService.addToHistory(userId, user.passwordHash);
        user.passwordHash = newHash;
        user.isDefaultPassword = false;
        user.passwordLastChangedDate = new Date();
        await this.userRepo.save(user);
        await this.auditService.log({
            userId,
            action: 'PASSWORD_CHANGE',
            entityType: 'User',
            entityId: userId,
            ipAddress,
            userAgent,
            status: 'SUCCESS'
        });
        return {
            message: 'Password changed successfully'
        };
    }
    toResponse(user) {
        return {
            userId: user.userId,
            username: user.username,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role,
            updatedDate: user.updatedDate
        };
    }
    constructor(userRepo, passwordService, auditService, sessionsService, rolesService){
        this.userRepo = userRepo;
        this.passwordService = passwordService;
        this.auditService = auditService;
        this.sessionsService = sessionsService;
        this.rolesService = rolesService;
    }
};
UsersService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_param(0, (0, _typeorm.InjectRepository)(_userentity.User)),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _typeorm1.Repository === "undefined" ? Object : _typeorm1.Repository,
        typeof _passwordservice.PasswordService === "undefined" ? Object : _passwordservice.PasswordService,
        typeof _auditservice.AuditService === "undefined" ? Object : _auditservice.AuditService,
        typeof _sessionsservice.SessionsService === "undefined" ? Object : _sessionsservice.SessionsService,
        typeof _rolesservice.RolesService === "undefined" ? Object : _rolesservice.RolesService
    ])
], UsersService);

//# sourceMappingURL=users.service.js.map