import { Injectable, Inject, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { RefreshDto } from './dto/refresh.dto';
import { PasswordResetRequestDto } from './dto/password-reset-request.dto';
import { PasswordResetConfirmDto } from './dto/password-reset-confirm.dto';
import { PasswordResetToken } from './entities/password-reset-token.entity';

const REFRESH_EXPIRY = '7d';

@Injectable()
export class AuthService {
  constructor(
    @Inject(UsersService) private readonly usersService: UsersService,
    @Inject(JwtService) private readonly jwtService: JwtService,
    @InjectRepository(PasswordResetToken)
    private readonly resetTokenRepo: Repository<PasswordResetToken>,
  ) {}

  async login(dto: LoginDto): Promise<{ accessToken: string; refreshToken: string }> {
    const user = await this.usersService.findByUsername(dto.username);
    if (!user) {
      throw new UnauthorizedException('Invalid username or password');
    }
    const match = await bcrypt.compare(dto.password, user.passwordHash);
    if (!match) {
      throw new UnauthorizedException('Invalid username or password');
    }
    const payload = {
      sub: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      permissions: {},
      sessionId: user.id,
    };
    const accessToken = this.jwtService.sign(payload, { expiresIn: '15m' });
    const refreshToken = this.jwtService.sign(
      { ...payload, type: 'refresh' },
      { expiresIn: REFRESH_EXPIRY },
    );
    return { accessToken, refreshToken };
  }

  async refresh(dto: RefreshDto): Promise<{ accessToken: string }> {
    try {
      const payload = this.jwtService.verify<{ sub: string; username: string; email: string; role: string; type?: string }>(
        dto.refreshToken,
      );
      if (payload.type !== 'refresh') {
        throw new UnauthorizedException('Invalid refresh token');
      }
      const user = await this.usersService.findById(payload.sub);
      if (!user) {
        throw new UnauthorizedException('User no longer exists');
      }
      const newPayload = {
        sub: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        permissions: {},
        sessionId: user.id,
      };
      const accessToken = this.jwtService.sign(newPayload, { expiresIn: '15m' });
      return { accessToken };
    } catch {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }

  async logout(): Promise<{ message: string }> {
    return { message: 'Logged out' };
  }

  async passwordResetRequest(dto: PasswordResetRequestDto): Promise<{ message: string; token?: string }> {
    const user = await this.usersService.findByEmail(dto.email);
    if (!user) {
      return { message: 'If that email is registered, a reset link has been sent.' };
    }
    await this.resetTokenRepo.delete({ userId: user.id });
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000);
    await this.resetTokenRepo.save(
      this.resetTokenRepo.create({ userId: user.id, token, expiresAt }),
    );
    return {
      message: 'If that email is registered, a reset link has been sent.',
      token: process.env.NODE_ENV !== 'production' ? token : undefined,
    };
  }

  async passwordResetConfirm(dto: PasswordResetConfirmDto): Promise<{ message: string }> {
    const record = await this.resetTokenRepo.findOne({
      where: { token: dto.token },
      relations: ['user'],
    });
    if (!record || record.expiresAt < new Date()) {
      throw new BadRequestException('Invalid or expired reset token');
    }
    const passwordHash = await bcrypt.hash(dto.newPassword, 10);
    await this.usersService.updatePassword(record.userId, passwordHash);
    await this.resetTokenRepo.remove(record);
    return { message: 'Password has been reset' };
  }
}
