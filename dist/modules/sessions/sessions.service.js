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
exports.SessionsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const config_1 = require("@nestjs/config");
const session_entity_1 = require("./entities/session.entity");
const encryption_util_1 = require("../../utils/encryption.util");
const constants_1 = require("../../utils/constants");
let SessionsService = class SessionsService {
    constructor(sessionRepo, config) {
        this.sessionRepo = sessionRepo;
        this.config = config;
        this.maxSessions = this.config.get('maxConcurrentSessions', 3);
    }
    async create(userId, refreshToken, ipAddress, userAgent) {
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + constants_1.REFRESH_TOKEN_EXPIRY_DAYS);
        const activeCount = await this.sessionRepo.count({
            where: { userId, isActive: true },
        });
        if (activeCount >= this.maxSessions) {
            const oldest = await this.sessionRepo.find({
                where: { userId, isActive: true },
                order: { createdDate: 'ASC' },
                take: activeCount - this.maxSessions + 1,
            });
            for (const s of oldest) {
                s.isActive = false;
                await this.sessionRepo.save(s);
            }
        }
        const session = this.sessionRepo.create({
            userId,
            refreshTokenHash: (0, encryption_util_1.hashToken)(refreshToken),
            ipAddress: ipAddress || null,
            userAgent: userAgent || null,
            expiresAt,
        });
        return this.sessionRepo.save(session);
    }
    async createPlaceholder(userId, ipAddress, userAgent) {
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + constants_1.REFRESH_TOKEN_EXPIRY_DAYS);
        const activeCount = await this.sessionRepo.count({
            where: { userId, isActive: true },
        });
        if (activeCount >= this.maxSessions) {
            const oldest = await this.sessionRepo.find({
                where: { userId, isActive: true },
                order: { createdDate: 'ASC' },
                take: activeCount - this.maxSessions + 1,
            });
            for (const s of oldest) {
                s.isActive = false;
                await this.sessionRepo.save(s);
            }
        }
        const session = this.sessionRepo.create({
            userId,
            refreshTokenHash: (0, encryption_util_1.hashToken)('pending'),
            ipAddress: ipAddress || null,
            userAgent: userAgent || null,
            expiresAt,
        });
        return this.sessionRepo.save(session);
    }
    async setRefreshTokenHash(sessionId, refreshToken) {
        await this.sessionRepo.update({ sessionId }, { refreshTokenHash: (0, encryption_util_1.hashToken)(refreshToken) });
    }
    async findBySessionId(sessionId) {
        return this.sessionRepo.findOne({
            where: { sessionId, isActive: true },
            relations: ['user', 'user.role'],
        });
    }
    async validateRefreshToken(sessionId, refreshToken) {
        const session = await this.sessionRepo.findOne({
            where: { sessionId, isActive: true },
            relations: ['user', 'user.role'],
        });
        if (!session || session.expiresAt < new Date())
            return null;
        const hash = (0, encryption_util_1.hashToken)(refreshToken);
        if (session.refreshTokenHash !== hash)
            return null;
        session.lastActivity = new Date();
        await this.sessionRepo.save(session);
        return session.user;
    }
    async revokeSession(sessionId, userId) {
        const session = await this.sessionRepo.findOne({
            where: { sessionId, userId },
        });
        if (!session)
            return false;
        session.isActive = false;
        await this.sessionRepo.save(session);
        return true;
    }
    async revokeAllForUser(userId) {
        await this.sessionRepo.update({ userId }, { isActive: false });
    }
    async getActiveSessions(userId, currentSessionId) {
        const sessions = await this.sessionRepo.find({
            where: { userId, isActive: true },
            order: { lastActivity: 'DESC' },
        });
        return sessions.map((s) => ({
            sessionId: s.sessionId,
            ipAddress: s.ipAddress,
            userAgent: s.userAgent,
            createdDate: s.createdDate,
            lastActivity: s.lastActivity,
            isCurrent: s.sessionId === currentSessionId,
        }));
    }
    async cleanupExpired() {
        const result = await this.sessionRepo.delete({
            expiresAt: (0, typeorm_2.LessThan)(new Date()),
        });
        return result.affected ?? 0;
    }
};
exports.SessionsService = SessionsService;
exports.SessionsService = SessionsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(session_entity_1.UserSession)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        config_1.ConfigService])
], SessionsService);
//# sourceMappingURL=sessions.service.js.map