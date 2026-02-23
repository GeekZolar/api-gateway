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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const password_reset_token_entity_1 = require("./entities/password-reset-token.entity");
const password_service_1 = require("./services/password.service");
const mfa_service_1 = require("./services/mfa.service");
const sessions_service_1 = require("../sessions/sessions.service");
const audit_service_1 = require("../audit/audit.service");
const encryption_util_1 = require("../../utils/encryption.util");
const user_entity_1 = require("../users/entities/user.entity");
const constants_1 = require("../../utils/constants");
const constants_2 = require("../../utils/constants");
let AuthService = class AuthService {
    constructor(userRepo, resetTokenRepo, jwtService, config, passwordService, mfaService, sessionsService, auditService) {
        this.userRepo = userRepo;
        this.resetTokenRepo = resetTokenRepo;
        this.jwtService = jwtService;
        this.config = config;
        this.passwordService = passwordService;
        this.mfaService = mfaService;
        this.sessionsService = sessionsService;
        this.auditService = auditService;
    }
    async validateUserByUsername(username, password) {
        const user = await this.userRepo.findOne({
            where: { username },
            relations: ['role'],
        });
        if (!user)
            return null;
        if (!user.isActive || !user.isApproved)
            return null;
        const valid = await this.passwordService.compare(password, user.passwordHash);
        return valid ? user : null;
    }
    async validateRefreshToken(sessionId, refreshToken) {
        return this.sessionsService.validateRefreshToken(sessionId, refreshToken);
    }
    async login(username, password, ipAddress, userAgent) {
        const lockoutAttempts = this.config.get('accountLockoutAttempts', 5);
        const lockoutDuration = this.config.get('accountLockoutDuration', 1800000);
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
            throw new common_1.UnauthorizedException('Invalid credentials');
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
            throw new common_1.ForbiddenException('Account is locked. Try again later.');
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
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        if (!user.isApproved || !user.isActive) {
            throw new common_1.ForbiddenException('Account is not approved or is inactive');
        }
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
        user.failedLoginAttempts = 0;
        user.accountLockedUntil = null;
        user.lastLoginDate = new Date();
        await this.userRepo.save(user);
        const session = await this.sessionsService.createPlaceholder(user.userId, ipAddress, userAgent);
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
            expiresIn: constants_1.ACCESS_TOKEN_EXPIRY_SECONDS,
            mfaRequired: false,
            user: this.toUserResponse(user),
            message: 'Login successful',
        };
    }
    generateAccessToken(user, sessionId) {
        const payload = {
            sub: user.userId,
            username: user.username,
            email: user.email,
            role: user.role?.roleName,
            permissions: user.role?.permissions || {},
            sessionId,
        };
        return this.jwtService.sign(payload, {
            secret: this.config.get('jwt.accessSecret'),
            expiresIn: this.config.get('jwt.accessExpiration', '15m'),
        });
    }
    generateRefreshToken(userId, sessionId) {
        const payload = { sub: userId, sessionId, type: 'refresh' };
        return this.jwtService.sign(payload, {
            secret: this.config.get('jwt.refreshSecret'),
            expiresIn: this.config.get('jwt.refreshExpiration', '7d'),
        });
    }
    generateMfaVerificationToken(userId, ipAddress, userAgent) {
        const payload = {
            sub: userId,
            type: 'mfa-verification',
            ipAddress,
            userAgent,
        };
        return this.jwtService.sign(payload, {
            secret: this.config.get('jwt.accessSecret'),
            expiresIn: '5m',
        });
    }
    async refresh(user, refreshToken, ipAddress, userAgent) {
        const sessionId = user.sessionId;
        const session = await this.sessionsService.findBySessionId(sessionId);
        if (!session)
            throw new common_1.UnauthorizedException('Session not found');
        const newRefreshToken = this.generateRefreshToken(user.userId, session.sessionId);
        await this.sessionsService.setRefreshTokenHash(session.sessionId, newRefreshToken);
        const accessToken = this.generateAccessToken(user, session.sessionId);
        return {
            accessToken,
            refreshToken: newRefreshToken,
            expiresIn: constants_1.ACCESS_TOKEN_EXPIRY_SECONDS,
        };
    }
    async logout(userId, sessionId) {
        await this.sessionsService.revokeSession(sessionId, userId);
        return { message: 'Successfully logged out' };
    }
    async mfaSetup(user, accountName) {
        if (user.email !== accountName)
            throw new common_1.BadRequestException('Account name does not match');
        if (user.mfaEnabled)
            throw new common_1.BadRequestException('MFA already enabled');
        const includeQrCode = this.config.get('mfaIncludeQrCode', true);
        const issuer = this.config.get('mfaIssuer', 'S&R IMS');
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
    async mfaVerify(userId, code) {
        const user = await this.userRepo.findOne({ where: { userId }, relations: ['role'] });
        if (!user || !user.mfaSecret)
            throw new common_1.BadRequestException('MFA not set up');
        const secret = this.mfaService.decryptSecret(user.mfaSecret);
        if (!this.mfaService.verifyToken(secret, code)) {
            throw new common_1.UnauthorizedException('Invalid code');
        }
        await this.userRepo.update(userId, { mfaEnabled: true });
        return { verified: true, message: 'MFA successfully enabled' };
    }
    async verifyMfaAndLogin(mfaToken, mfaCode, ipAddress, userAgent) {
        let payload;
        try {
            payload = this.jwtService.verify(mfaToken, {
                secret: this.config.get('jwt.accessSecret'),
            });
        }
        catch (error) {
            throw new common_1.UnauthorizedException('Invalid or expired MFA verification token');
        }
        if (payload.type !== 'mfa-verification') {
            throw new common_1.UnauthorizedException('Invalid token type');
        }
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
            throw new common_1.UnauthorizedException('Security validation failed');
        }
        const user = await this.userRepo.findOne({
            where: { userId: payload.sub },
            relations: ['role'],
        });
        if (!user || !user.mfaEnabled || !user.mfaSecret) {
            throw new common_1.BadRequestException('MFA not enabled for this user');
        }
        if (!user.isApproved || !user.isActive) {
            throw new common_1.ForbiddenException('Account is not approved or is inactive');
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
            throw new common_1.UnauthorizedException('Invalid MFA code');
        }
        user.failedLoginAttempts = 0;
        user.accountLockedUntil = null;
        user.lastLoginDate = new Date();
        await this.userRepo.save(user);
        const session = await this.sessionsService.createPlaceholder(user.userId, ipAddress, userAgent);
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
            expiresIn: constants_1.ACCESS_TOKEN_EXPIRY_SECONDS,
            mfaRequired: false,
            user: this.toUserResponse(user),
        };
    }
    async passwordResetRequest(email, ipAddress) {
        const user = await this.userRepo.findOne({ where: { email } });
        if (user) {
            const token = (0, encryption_util_1.generateSecureToken)(32);
            const expiresAt = new Date();
            expiresAt.setHours(expiresAt.getHours() + constants_2.PASSWORD_RESET_TOKEN_EXPIRY_HOURS);
            await this.resetTokenRepo.save(this.resetTokenRepo.create({
                userId: user.userId,
                tokenHash: (0, encryption_util_1.hashToken)(token),
                expiresAt,
            }));
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
    async passwordResetConfirm(token, newPassword) {
        const hash = (0, encryption_util_1.hashToken)(token);
        const record = await this.resetTokenRepo.findOne({
            where: { tokenHash: hash, isUsed: false },
            relations: ['user', 'user.role'],
        });
        if (!record || record.expiresAt < new Date()) {
            throw new common_1.BadRequestException('Invalid or expired token');
        }
        const validation = this.passwordService.validateStrength(newPassword);
        if (!validation.valid)
            throw new common_1.BadRequestException(validation.message);
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
    async getActiveSessions(userId, currentSessionId) {
        return this.sessionsService.getActiveSessions(userId, currentSessionId);
    }
    async revokeSession(userId, sessionId) {
        const ok = await this.sessionsService.revokeSession(sessionId, userId);
        if (!ok)
            throw new common_1.BadRequestException('Session not found');
        return { message: 'Session revoked' };
    }
    toUserResponse(user) {
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
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(1, (0, typeorm_1.InjectRepository)(password_reset_token_entity_1.PasswordResetToken)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        jwt_1.JwtService,
        config_1.ConfigService,
        password_service_1.PasswordService,
        mfa_service_1.MfaService,
        sessions_service_1.SessionsService,
        audit_service_1.AuditService])
], AuthService);
//# sourceMappingURL=auth.service.js.map