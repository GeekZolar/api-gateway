import {
  Injectable,
  ConflictException,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserQueryDto } from './dto/user-query.dto';
import { PasswordService } from '../auth/services/password.service';
import { AuditService } from '../audit/audit.service';
import { SessionsService } from '../sessions/sessions.service';
import { RolesService } from '../roles/roles.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
    private passwordService: PasswordService,
    private auditService: AuditService,
    private sessionsService: SessionsService,
    private rolesService: RolesService,
  ) {}

  async create(
    dto: CreateUserDto,
    createdBy?: string,
    ipAddress?: string,
    userAgent?: string,
  ) {
    const existingUsername = await this.userRepo.findOne({ where: { username: dto.username } });
    if (existingUsername) throw new ConflictException('Username already exists');
    const existingEmail = await this.userRepo.findOne({ where: { email: dto.email } });
    if (existingEmail) throw new ConflictException('Email already exists');

    const roleExists = await this.rolesService.validateRoleId(dto.roleId);
    if (!roleExists) throw new BadRequestException('Invalid role');

    const validation = this.passwordService.validateStrength(dto.password);
    if (!validation.valid) throw new BadRequestException(validation.message);

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
      isDefaultPassword: saved.isDefaultPassword,
      message: 'User created successfully. Pending approval.',
    };
  }

  async approve(
    userId: string,
    approvedBy: string,
    ipAddress?: string,
    userAgent?: string,
  ) {
    const user = await this.userRepo.findOne({ where: { userId }, relations: ['role'] });
    if (!user) throw new NotFoundException('User not found');
    if (user.isApproved) throw new BadRequestException('User already approved');

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

  async update(
    userId: string,
    dto: UpdateUserDto,
    updatedBy: string,
    isAdmin: boolean,
    ipAddress?: string,
    userAgent?: string,
  ) {
    const user = await this.userRepo.findOne({ where: { userId }, relations: ['role'] });
    if (!user) throw new NotFoundException('User not found');

    const oldValues = { ...user };
    if (dto.firstName !== undefined) user.firstName = dto.firstName;
    if (dto.lastName !== undefined) user.lastName = dto.lastName;
    if (dto.email !== undefined) {
      const existing = await this.userRepo.findOne({ where: { email: dto.email } });
      if (existing && existing.userId !== userId) throw new ConflictException('Email already in use');
      user.email = dto.email;
    }
    if (dto.roleId !== undefined) {
      if (!isAdmin) throw new ForbiddenException('Only admins can change roles');
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
      newValues: dto as unknown as Record<string, unknown>,
      ipAddress,
      userAgent,
      status: 'SUCCESS',
    });

    return this.toResponse(user);
  }

  async setStatus(
    userId: string,
    isActive: boolean,
    updatedBy: string,
    ipAddress?: string,
    userAgent?: string,
  ) {
    const user = await this.userRepo.findOne({ where: { userId }, relations: ['role'] });
    if (!user) throw new NotFoundException('User not found');

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

  async findPaginated(query: UserQueryDto) {
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
      qb.andWhere(
        '(u.username ILIKE :search OR u.email ILIKE :search OR u.firstName ILIKE :search OR u.lastName ILIKE :search)',
        { search: `%${search}%` },
      );
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

  async findOne(userId: string) {
    const user = await this.userRepo.findOne({
      where: { userId },
      relations: ['role'],
    });
    if (!user) throw new NotFoundException('User not found');
    return this.toResponse(user);
  }

  async changePassword(
    userId: string,
    currentPassword: string,
    newPassword: string,
    confirmPassword: string,
    ipAddress?: string,
    userAgent?: string,
  ) {
    if (newPassword !== confirmPassword) {
      throw new BadRequestException('Passwords do not match');
    }
    const user = await this.userRepo.findOne({ where: { userId } });
    if (!user) throw new NotFoundException('User not found');

    const valid = await this.passwordService.compare(currentPassword, user.passwordHash);
    if (!valid) throw new BadRequestException('Current password is incorrect');

    const validation = this.passwordService.validateStrength(newPassword);
    if (!validation.valid) throw new BadRequestException(validation.message);

    const newHash = await this.passwordService.hash(newPassword);
    const inHistory = await this.passwordService.isInHistory(userId, newHash);
    if (inHistory) throw new BadRequestException('Cannot reuse one of your last 5 passwords');

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
      status: 'SUCCESS',
    });

    return { message: 'Password changed successfully' };
  }

  private toResponse(user: User) {
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
}
