import { ConfigService } from '@nestjs/config';
export interface MfaGenerateSecretOptions {
    issuer: string;
    accountName: string;
}
export declare class MfaService {
    private config;
    private readonly defaultIssuer;
    private readonly window;
    constructor(config: ConfigService);
    generateSecret(options: MfaGenerateSecretOptions): {
        secret: string;
        otpauthUrl: string;
    };
    getQrCodeUrl(otpauthUrl: string): Promise<string>;
    verifyToken(secret: string, token: string): boolean;
    encryptSecret(secret: string): string;
    decryptSecret(encrypted: string): string;
    generateBackupCodes(): string[];
}
