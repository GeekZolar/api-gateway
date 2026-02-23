import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { PasswordResetToken } from './entities/password-reset-token.entity';
import { PasswordService } from './services/password.service';
import { MfaService } from './services/mfa.service';
import { SessionsService } from '../sessions/sessions.service';
import { AuditService } from '../audit/audit.service';
import { hashToken, generateSecureToken } from '../../utils/encryption.util';
import { User as UserEntity } from '../users/entities/user.entity';
import { ACCESS_TOKEN_EXPIRY_SECONDS } from '../../utils/constants';
import { PASSWORD_RESET_TOKEN_EXPIRY_HOURS } from '../../utils/constants';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepo: Repository<UserEntity>,
    @InjectRepository(PasswordResetToken)
    private resetTokenRepo: Repository<PasswordResetToken>,
    private jwtService: JwtService,
    private config: ConfigService,
    private passwordService: PasswordService,
    private mfaService: MfaService,
    private sessionsService: SessionsService,
    private auditService: AuditService,
  ) {}

  async validateUserByUsername(username: string, password: string): Promise<User | null> {
    const user = await this.userRepo.findOne({
      where: { username },
      relations: ['role'],
    });
    if (!user) return null;
    if (!user.isActive || !user.isApproved) return null;
    const valid = await this.passwordService.compare(password, user.passwordHash);
    return valid ? user : null;
  }

  async validateRefreshToken(sessionId: string, refreshToken: string): Promise<User | null> {
    return this.sessionsService.validateRefreshToken(sessionId, refreshToken);
  }

  async login(
    username: string,
    password: string,
    ipAddress?: string,
    userAgent?: string,
  ) {
    const lockoutAttempts = this.config.get<number>('accountLockoutAttempts', 5);
    const lockoutDuration = this.config.get<number>('accountLockoutDuration', 1800000);

    const user = await this.userRepo.findOne({
      where: { username },
      relations: ['role'],
    });

    if (!user) {
      await this.auditService.log({
        action: 'LOGIN',
        entityType: 'User',
        status: 'FAILED',
        errorMessage: 'Invalid credentials',
        ipAddress,
        userAgent,
      });
      throw new UnauthorizedException('Invalid credentials');
    }

    if (user.accountLockedUntil && user.accountLockedUntil > new Date()) {
      await this.auditService.log({
        userId: user.userId,
        action: 'LOGIN',
        entityType: 'User',
        status: 'FAILED',
        errorMessage: 'Account locked',
        ipAddress,
        userAgent,
      });
      throw new ForbiddenException('Account is locked. Try again later.');
    }

    const passwordValid = await this.passwordService.compare(password, user.passwordHash);
    if (!passwordValid) {
      user.failedLoginAttempts = (user.failedLoginAttempts || 0) + 1;
      if (user.failedLoginAttempts >= lockoutAttempts) {
        user.accountLockedUntil = new Date(Date.now() + lockoutDuration);
      }
      await this.userRepo.save(user);
      await this.auditService.log({
        userId: user.userId,
        action: 'LOGIN',
        entityType: 'User',
        status: 'FAILED',
        errorMessage: 'Invalid password',
        ipAddress,
        userAgent,
      });
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!user.isApproved || !user.isActive) {
      throw new ForbiddenException('Account is not approved or is inactive');
    }

    // If MFA is enabled, return a temporary token for MFA verification
    if (user.mfaEnabled && user.mfaSecret) {
      const mfaToken = this.generateMfaVerificationToken(user.userId, ipAddress, userAgent);
      return {
        accessToken: '',
        refreshToken: '',
        mfaToken,
        expiresIn: 0,
        mfaRequired: true,
        user: null,
        message: 'MFA code required',
      };
    }

    // Complete login if MFA is not enabled
    user.failedLoginAttempts = 0;
    user.accountLockedUntil = null;
    user.lastLoginDate = new Date();
    await this.userRepo.save(user);

    const session = await this.sessionsService.createPlaceholder(
      user.userId,
      ipAddress,
      userAgent,
    );
    const refreshToken = this.generateRefreshToken(user.userId, session.sessionId);
    await this.sessionsService.setRefreshTokenHash(session.sessionId, refreshToken);
    const accessToken = this.generateAccessToken(user, session.sessionId);

    await this.auditService.log({
      userId: user.userId,
      action: 'LOGIN',
      entityType: 'User',
      status: 'SUCCESS',
      ipAddress,
      userAgent,
    });

    return {
      accessToken,
      refreshToken,
      mfaToken: '',
      expiresIn: ACCESS_TOKEN_EXPIRY_SECONDS,
      mfaRequired: false,
      user: this.toUserResponse(user),
      message: 'Login successful',
    };
  }

  private generateAccessToken(user: User, sessionId: string): string {
    const payload = {
      sub: user.userId,
      username: user.username,
      email: user.email,
      role: user.role?.roleName,
      permissions: user.role?.permissions || {},
      sessionId,
    };
    return this.jwtService.sign(payload, {
      secret: this.config.get<string>('jwt.accessSecret'),
      expiresIn: this.config.get<string>('jwt.accessExpiration', '15m'),
    });
  }

  private generateRefreshToken(userId: string, sessionId: string): string {
    const payload = { sub: userId, sessionId, type: 'refresh' };
    return this.jwtService.sign(payload, {
      secret: this.config.get<string>('jwt.refreshSecret'),
      expiresIn: this.config.get<string>('jwt.refreshExpiration', '7d'),
    });
  }

  private generateMfaVerificationToken(
    userId: string,
    ipAddress?: string,
    userAgent?: string,
  ): string {
    const payload = {
      sub: userId,
      type: 'mfa-verification',
      ipAddress,
      userAgent,
    };
    return this.jwtService.sign(payload, {
      secret: this.config.get<string>('jwt.accessSecret'),
      expiresIn: '5m', // Short-lived token for MFA verification
    });
  }

  async refresh(
    user: User,
    refreshToken: string,
    ipAddress?: string,
    userAgent?: string,
  ) {
    const sessionId = (user as unknown as { sessionId?: string }).sessionId!;
    const session = await this.sessionsService.findBySessionId(sessionId);
    if (!session) throw new UnauthorizedException('Session not found');

    const newRefreshToken = this.generateRefreshToken(user.userId, session.sessionId);
    await this.sessionsService.setRefreshTokenHash(session.sessionId, newRefreshToken);

    const accessToken = this.generateAccessToken(user, session.sessionId);

    return {
      accessToken,
      refreshToken: newRefreshToken,
      expiresIn: ACCESS_TOKEN_EXPIRY_SECONDS,
    };
  }

  async logout(userId: string, sessionId: string) {
    await this.sessionsService.revokeSession(sessionId, userId);
    return { message: 'Successfully logged out' };
  }

  async mfaSetup(
    user: User,    accountName: string // options: { issuer: string; accountName: string; includeQrCode?: boolean },
  ) {
    if (user.email !== accountName) throw new BadRequestException('Account name does not match');
    if (user.mfaEnabled) throw new BadRequestException('MFA already enabled');
    const includeQrCode = this.config.get<boolean>('mfaIncludeQrCode', true);
    const issuer = this.config.get<string>('mfaIssuer', 'S&R IMS');
    const { secret, otpauthUrl } = this.mfaService.generateSecret({
      issuer: issuer,
      accountName: user.email,
    });
    includeQrCode !== false;
    const qrCodeUrl = includeQrCode ? await this.mfaService.getQrCodeUrl(otpauthUrl) : undefined;
    const backupCodes = this.mfaService.generateBackupCodes();
    const encryptedSecret = this.mfaService.encryptSecret(secret);
    await this.userRepo.update(user.userId, { mfaSecret: encryptedSecret, mfaEnabled: true });
    return { secret, otpauthUrl, qrCodeUrl, backupCodes,
      mfaEnabled: true,
      mfaSecret: encryptedSecret,
    };
  }

  async mfaVerify(userId: string, code: string) {
    const user = await this.userRepo.findOne({ where: { userId }, relations: ['role'] });
    if (!user || !user.mfaSecret) throw new BadRequestException('MFA not set up');
    const secret = this.mfaService.decryptSecret(user.mfaSecret);
    if (!this.mfaService.verifyToken(secret, code)) {
      throw new UnauthorizedException('Invalid code');
    }
    await this.userRepo.update(userId, { mfaEnabled: true });
    return { verified: true, message: 'MFA successfully enabled' };
  }

  async verifyMfaAndLogin(
    mfaToken: string,
    mfaCode: string,
    ipAddress?: string,
    userAgent?: string,
  ) {
    let payload: any;
    try {
      payload = this.jwtService.verify(mfaToken, {
        secret: this.config.get<string>('jwt.accessSecret'),
      });
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired MFA verification token');
    }

    if (payload.type !== 'mfa-verification') {
      throw new UnauthorizedException('Invalid token type');
    }

    // Verify IP address and user agent match (optional security check)
    if (payload.ipAddress && payload.ipAddress !== ipAddress) {
      await this.auditService.log({
        userId: payload.sub,
        action: 'MFA_VERIFY',
        entityType: 'User',
        status: 'FAILED',
        errorMessage: 'IP address mismatch',
        ipAddress,
        userAgent,
      });
      throw new UnauthorizedException('Security validation failed');
    }

    const user = await this.userRepo.findOne({
      where: { userId: payload.sub },
      relations: ['role'],
    });

    if (!user || !user.mfaEnabled || !user.mfaSecret) {
      throw new BadRequestException('MFA not enabled for this user');
    }

    if (!user.isApproved || !user.isActive) {
      throw new ForbiddenException('Account is not approved or is inactive');
    }

    const secret = this.mfaService.decryptSecret(user.mfaSecret);
    if (!this.mfaService.verifyToken(secret, mfaCode)) {
      await this.auditService.log({
        userId: user.userId,
        action: 'MFA_VERIFY',
        entityType: 'User',
        status: 'FAILED',
        errorMessage: 'Invalid MFA code',
        ipAddress,
        userAgent,
      });
      throw new UnauthorizedException('Invalid MFA code');
    }

    // Complete login
    user.failedLoginAttempts = 0;
    user.accountLockedUntil = null;
    user.lastLoginDate = new Date();
    await this.userRepo.save(user);

    const session = await this.sessionsService.createPlaceholder(
      user.userId,
      ipAddress,
      userAgent,
    );
    const refreshToken = this.generateRefreshToken(user.userId, session.sessionId);
    await this.sessionsService.setRefreshTokenHash(session.sessionId, refreshToken);
    const accessToken = this.generateAccessToken(user, session.sessionId);

    await this.auditService.log({
      userId: user.userId,
      action: 'LOGIN',
      entityType: 'User',
      status: 'SUCCESS',
      ipAddress,
      userAgent,
    });

    await this.auditService.log({
      userId: user.userId,
      action: 'MFA_VERIFY',
      entityType: 'User',
      status: 'SUCCESS',
      ipAddress,
      userAgent,
    });

    return {
      accessToken,
      refreshToken,
      expiresIn: ACCESS_TOKEN_EXPIRY_SECONDS,
      mfaRequired: false,
      user: this.toUserResponse(user),
    };
  }

  async passwordResetRequest(email: string, ipAddress?: string) {
    const user = await this.userRepo.findOne({ where: { email } });
    if (user) {
      const token = generateSecureToken(32);
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + PASSWORD_RESET_TOKEN_EXPIRY_HOURS);
      await this.resetTokenRepo.save(
        this.resetTokenRepo.create({
          userId: user.userId,
          tokenHash: hashToken(token),
          expiresAt,
        }),
      );
      await this.auditService.log({
        userId: user.userId,
        action: 'PASSWORD_RESET_REQUEST',
        entityType: 'User',
        status: 'SUCCESS',
        ipAddress,
      });
    }
    return { message: 'If the email exists, a reset link has been sent' };
  }

  async passwordResetConfirm(token: string, newPassword: string) {
    const hash = hashToken(token);
    const record = await this.resetTokenRepo.findOne({
      where: { tokenHash: hash, isUsed: false },
      relations: ['user', 'user.role'],
    });
    if (!record || record.expiresAt < new Date()) {
      throw new BadRequestException('Invalid or expired token');
    }
    const validation = this.passwordService.validateStrength(newPassword);
    if (!validation.valid) throw new BadRequestException(validation.message);
    const passwordHash = await this.passwordService.hash(newPassword);
    await this.passwordService.addToHistory(record.userId, passwordHash);
    record.user.passwordHash = passwordHash;
    record.user.passwordLastChangedDate = new Date();
    await this.userRepo.save(record.user);
    record.isUsed = true;
    await this.resetTokenRepo.save(record);
    await this.auditService.log({
      userId: record.userId,
      action: 'PASSWORD_RESET_CONFIRM',
      entityType: 'User',
      status: 'SUCCESS',
    });
    return { message: 'Password reset successfully' };
  }

  async getActiveSessions(userId: string, currentSessionId?: string) {
    return this.sessionsService.getActiveSessions(userId, currentSessionId);
  }

  async revokeSession(userId: string, sessionId: string) {
    const ok = await this.sessionsService.revokeSession(sessionId, userId);
    if (!ok) throw new BadRequestException('Session not found');
    return { message: 'Session revoked' };
  }

  private toUserResponse(user: User) {
    return {
      userId: user.userId,
      username: user.username,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role?.roleName,
      permissions: user.role?.permissions || {},
    };
  }
}
