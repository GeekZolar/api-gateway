import { User } from '../../users/entities/user.entity';
export declare class UserSession {
    sessionId: string;
    userId: string;
    user: User;
    refreshTokenHash: string;
    ipAddress: string | null;
    userAgent: string | null;
    isActive: boolean;
    createdDate: Date;
    expiresAt: Date;
    lastActivity: Date;
}
