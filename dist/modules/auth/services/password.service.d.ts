import { ConfigService } from '@nestjs/config';
import { Repository } from 'typeorm';
import { PasswordHistory } from '../../users/entities/password-history.entity';
export declare class PasswordService {
    private config;
    private passwordHistoryRepo;
    private readonly rounds;
    constructor(config: ConfigService, passwordHistoryRepo: Repository<PasswordHistory>);
    hash(password: string): Promise<string>;
    compare(plain: string, hash: string): Promise<boolean>;
    validateStrength(password: string): {
        valid: boolean;
        message?: string;
    };
    isInHistory(userId: string, newPasswordHash: string): Promise<boolean>;
    addToHistory(userId: string, passwordHash: string): Promise<void>;
}
