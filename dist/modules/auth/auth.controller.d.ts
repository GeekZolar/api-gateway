import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { MfaVerifyDto } from './dto/mfa-verify.dto';
import { MfaSetupDto } from './dto/mfa-setup.dto';
import { MfaLoginVerifyDto } from './dto/mfa-login-verify.dto';
import { PasswordResetRequestDto, PasswordResetConfirmDto } from './dto/password-reset.dto';
import { RequestWithUser } from '../../common/interfaces/request-with-user.interface';
import { User } from '../users/entities/user.entity';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    login(dto: LoginDto, req: RequestWithUser): Promise<{
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
    verifyMfaAndLogin(dto: MfaLoginVerifyDto, req: RequestWithUser): Promise<{
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
    refresh(dto: RefreshTokenDto, req: RequestWithUser): Promise<{
        accessToken: string;
        refreshToken: string;
        expiresIn: number;
    }>;
    logout(userId: string, sessionId: string): Promise<{
        message: string;
    }>;
    mfaSetup(user: User, dto: MfaSetupDto): Promise<{
        secret: string;
        otpauthUrl: string;
        qrCodeUrl: string | undefined;
        backupCodes: string[];
        mfaEnabled: boolean;
        mfaSecret: string;
    }>;
    mfaVerify(userId: string, dto: MfaVerifyDto): Promise<{
        verified: boolean;
        message: string;
    }>;
    passwordResetRequest(dto: PasswordResetRequestDto, req: RequestWithUser): Promise<{
        message: string;
    }>;
    passwordResetConfirm(dto: PasswordResetConfirmDto): Promise<{
        message: string;
    }>;
    getSessions(userId: string, sessionId: string): Promise<{
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
}
