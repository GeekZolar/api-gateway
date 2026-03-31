import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { isCommonPassword } from '../../../utils/validators.util';
import { PASSWORD_HISTORY_COUNT } from '../../../utils/constants';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PasswordHistory } from '../../users/entities/password-history.entity';

@Injectable()
export class PasswordService {
  private readonly rounds: number;

  constructor(
    private config: ConfigService,
    @InjectRepository(PasswordHistory)
    private passwordHistoryRepo: Repository<PasswordHistory>,
  ) {
    this.rounds = this.config.get<number>('bcryptRounds', 12) || 12;
  }

  async hash(password: string): Promise<string> {
    return bcrypt.hash(password, this.rounds);
  }

  async compare(plain: string, hash: string): Promise<boolean> {
    return bcrypt.compare(plain, hash);
  }

  validateStrength(password: string): { valid: boolean; message?: string } {
    if (password.length < 8) {
      return { valid: false, message: 'Password must be at least 8 characters' };
    }
    if (!/[a-z]/.test(password)) {
      return { valid: false, message: 'Password must contain lowercase' };
    }
    if (!/[A-Z]/.test(password)) {
      return { valid: false, message: 'Password must contain uppercase' };
    }
    if (!/\d/.test(password)) {
      return { valid: false, message: 'Password must contain a number' };
    }
    if (!/[@$!%*?&]/.test(password)) {
      return { valid: false, message: 'Password must contain a special character (@$!%*?&)' };
    }
    if (isCommonPassword(password)) {
      return { valid: false, message: 'Password is too common' };
    }
    return { valid: true };
  }

  async isInHistory(userId: string, newPasswordHash: string): Promise<boolean> {
    const recent = await this.passwordHistoryRepo.find({
      where: { userId },
      order: { createdDate: 'DESC' },
      take: PASSWORD_HISTORY_COUNT,
    });
    return recent.some((r) => r.passwordHash === newPasswordHash);
  }

  async addToHistory(userId: string, passwordHash: string): Promise<void> {
    await this.passwordHistoryRepo.save(
      this.passwordHistoryRepo.create({ userId, passwordHash }),
    );
    const all = await this.passwordHistoryRepo.find({
      where: { userId },
      order: { createdDate: 'DESC' },
    });
    if (all.length > PASSWORD_HISTORY_COUNT) {
      const toRemove = all.slice(PASSWORD_HISTORY_COUNT);
      await this.passwordHistoryRepo.remove(toRemove);
    }
  }
}
