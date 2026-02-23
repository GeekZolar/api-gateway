import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { PasswordResetToken } from './entities/password-reset-token.entity';
import { PasswordService } from './services/password.service';
import { MfaService } from './services/mfa.service';
import { SessionsService } from '../sessions/sessions.service';
import { AuditService } from '../audit/audit.service';
import { User as UserEntity } from '../users/entities/user.entity';
export declare class AuthService {
    private userRepo;
    private resetTokenRepo;
    private jwtService;
    private config;
    private passwordService;
    private mfaService;
    private sessionsService;
    private auditService;
    constructor(userRepo: Repository<UserEntity>, resetTokenRepo: Repository<PasswordResetToken>, jwtService: JwtService, config: ConfigService, passwordService: PasswordService, mfaService: MfaService, sessionsService: SessionsService, auditService: AuditService);
    validateUserByUsername(username: string, password: string): Promise<User | null>;
    validateRefreshToken(sessionId: string, refreshToken: string): Promise<User | null>;
    login(username: string, password: string, ipAddress?: string, userAgent?: string): Promise<{
        accessToken: string;
        refreshToken: string;
        mfaToken: string;
        expiresIn: number;
        mfaRequired: boolean;
        user: null;
        message: string;
    } | {
        accessToken: string;
        refreshToken: string;
        mfaToken: string;
        expiresIn: number;
        mfaRequired: boolean;
        user: {
            userId: string;
            username: string;
            email: string;
            firstName: string;
            lastName: string;
            role: string;
            permissions: Record<string, string[]>;
        };
        message: string;
    }>;
    private generateAccessToken;
    private generateRefreshToken;
    private generateMfaVerificationToken;
    refresh(user: User, refreshToken: string, ipAddress?: string, userAgent?: string): Promise<{
        accessToken: string;
        refreshToken: string;
        expiresIn: number;
    }>;
    logout(userId: string, sessionId: string): Promise<{
        message: string;
    }>;
    mfaSetup(user: User, accountName: string): Promise<{
        secret: string;
        otpauthUrl: string;
        qrCodeUrl: string | undefined;
        backupCodes: string[];
        mfaEnabled: boolean;
        mfaSecret: string;
    }>;
    mfaVerify(userId: string, code: string): Promise<{
        verified: boolean;
        message: string;
    }>;
    verifyMfaAndLogin(mfaToken: string, mfaCode: string, ipAddress?: string, userAgent?: string): Promise<{
        accessToken: string;
        refreshToken: string;
        expiresIn: number;
        mfaRequired: boolean;
        user: {
            userId: string;
            username: string;
            email: string;
            firstName: string;
            lastName: string;
            role: string;
            permissions: Record<string, string[]>;
        };
    }>;
    passwordResetRequest(email: string, ipAddress?: string): Promise<{
        message: string;
    }>;
    passwordResetConfirm(token: string, newPassword: string): Promise<{
        message: string;
    }>;
    getActiveSessions(userId: string, currentSessionId?: string): Promise<{
        sessionId: string;
        ipAddress: string | null;
        userAgent: string | null;
        createdDate: Date;
        lastActivity: Date;
        isCurrent: boolean;
    }[]>;
    revokeSession(userId: string, sessionId: string): Promise<{
        message: string;
    }>;
    private toUserResponse;
}
