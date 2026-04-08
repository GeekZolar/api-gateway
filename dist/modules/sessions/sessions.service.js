"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "SessionsService", {
    enumerable: true,
    get: function() {
        return SessionsService;
    }
});
const _common = require("@nestjs/common");
const _typeorm = require("@nestjs/typeorm");
const _typeorm1 = require("typeorm");
const _config = require("@nestjs/config");
const _sessionentity = require("./entities/session.entity");
const _encryptionutil = require("../../utils/encryption.util");
const _constants = require("../../utils/constants");
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
let SessionsService = class SessionsService {
    async create(userId, refreshToken, ipAddress, userAgent) {
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + _constants.REFRESH_TOKEN_EXPIRY_DAYS);
        const activeCount = await this.sessionRepo.count({
            where: {
                userId,
                isActive: true
            }
        });
        if (activeCount >= this.maxSessions) {
            const oldest = await this.sessionRepo.find({
                where: {
                    userId,
                    isActive: true
                },
                order: {
                    createdDate: 'ASC'
                },
                take: activeCount - this.maxSessions + 1
            });
            for (const s of oldest){
                s.isActive = false;
                await this.sessionRepo.save(s);
            }
        }
        const session = this.sessionRepo.create({
            userId,
            refreshTokenHash: (0, _encryptionutil.hashToken)(refreshToken),
            ipAddress: ipAddress || null,
            userAgent: userAgent || null,
            expiresAt
        });
        return this.sessionRepo.save(session);
    }
    /** Create session placeholder; caller sets refresh token hash after generating JWT. */ async createPlaceholder(userId, ipAddress, userAgent) {
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + _constants.REFRESH_TOKEN_EXPIRY_DAYS);
        const activeCount = await this.sessionRepo.count({
            where: {
                userId,
                isActive: true
            }
        });
        if (activeCount >= this.maxSessions) {
            const oldest = await this.sessionRepo.find({
                where: {
                    userId,
                    isActive: true
                },
                order: {
                    createdDate: 'ASC'
                },
                take: activeCount - this.maxSessions + 1
            });
            for (const s of oldest){
                s.isActive = false;
                await this.sessionRepo.save(s);
            }
        }
        const session = this.sessionRepo.create({
            userId,
            refreshTokenHash: (0, _encryptionutil.hashToken)('pending'),
            ipAddress: ipAddress || null,
            userAgent: userAgent || null,
            expiresAt
        });
        return this.sessionRepo.save(session);
    }
    async setRefreshTokenHash(sessionId, refreshToken) {
        await this.sessionRepo.update({
            sessionId
        }, {
            refreshTokenHash: (0, _encryptionutil.hashToken)(refreshToken)
        });
    }
    async findBySessionId(sessionId) {
        return this.sessionRepo.findOne({
            where: {
                sessionId,
                isActive: true
            },
            relations: [
                'user',
                'user.role'
            ]
        });
    }
    async validateRefreshToken(sessionId, refreshToken) {
        const session = await this.sessionRepo.findOne({
            where: {
                sessionId,
                isActive: true
            },
            relations: [
                'user',
                'user.role'
            ]
        });
        if (!session || session.expiresAt < new Date()) return null;
        const hash = (0, _encryptionutil.hashToken)(refreshToken);
        if (session.refreshTokenHash !== hash) return null;
        session.lastActivity = new Date();
        await this.sessionRepo.save(session);
        return session.user;
    }
    async revokeSession(sessionId, userId) {
        const session = await this.sessionRepo.findOne({
            where: {
                sessionId,
                userId
            }
        });
        if (!session) return false;
        session.isActive = false;
        await this.sessionRepo.save(session);
        return true;
    }
    async revokeAllForUser(userId) {
        await this.sessionRepo.update({
            userId
        }, {
            isActive: false
        });
    }
    async getActiveSessions(userId, currentSessionId) {
        const sessions = await this.sessionRepo.find({
            where: {
                userId,
                isActive: true
            },
            order: {
                lastActivity: 'DESC'
            }
        });
        return sessions.map((s)=>({
                sessionId: s.sessionId,
                ipAddress: s.ipAddress,
                userAgent: s.userAgent,
                createdDate: s.createdDate,
                lastActivity: s.lastActivity,
                isCurrent: s.sessionId === currentSessionId
            }));
    }
    async cleanupExpired() {
        const result = await this.sessionRepo.delete({
            expiresAt: (0, _typeorm1.LessThan)(new Date())
        });
        return result.affected ?? 0;
    }
    constructor(sessionRepo, config){
        this.sessionRepo = sessionRepo;
        this.config = config;
        this.maxSessions = this.config.get('maxConcurrentSessions', 3);
    }
};
SessionsService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_param(0, (0, _typeorm.InjectRepository)(_sessionentity.UserSession)),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _typeorm1.Repository === "undefined" ? Object : _typeorm1.Repository,
        typeof _config.ConfigService === "undefined" ? Object : _config.ConfigService
    ])
], SessionsService);

//# sourceMappingURL=sessions.service.js.map