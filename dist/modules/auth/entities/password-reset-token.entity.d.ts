import { User } from '../../users/entities/user.entity';
export declare class PasswordResetToken {
    tokenId: string;
    userId: string;
    user: User;
    tokenHash: string;
    expiresAt: Date;
    isUsed: boolean;
    createdDate: Date;
}
