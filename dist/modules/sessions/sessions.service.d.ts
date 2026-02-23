import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { UserSession } from './entities/session.entity';
import { User } from '../users/entities/user.entity';
export declare class SessionsService {
    private sessionRepo;
    private config;
    private readonly maxSessions;
    constructor(sessionRepo: Repository<UserSession>, config: ConfigService);
    create(userId: string, refreshToken: string, ipAddress?: string, userAgent?: string): Promise<UserSession>;
    createPlaceholder(userId: string, ipAddress?: string, userAgent?: string): Promise<UserSession>;
    setRefreshTokenHash(sessionId: string, refreshToken: string): Promise<void>;
    findBySessionId(sessionId: string): Promise<UserSession | null>;
    validateRefreshToken(sessionId: string, refreshToken: string): Promise<User | null>;
    revokeSession(sessionId: string, userId: string): Promise<boolean>;
    revokeAllForUser(userId: string): Promise<void>;
    getActiveSessions(userId: string, currentSessionId?: string): Promise<{
        sessionId: string;
        ipAddress: string | null;
        userAgent: string | null;
        createdDate: Date;
        lastActivity: Date;
        isCurrent: boolean;
    }[]>;
    cleanupExpired(): Promise<number>;
}
