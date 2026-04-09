import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { UserSession } from './entities/session.entity';
import { hashToken } from '../../utils/encryption.util';
import { REFRESH_TOKEN_EXPIRY_DAYS } from '../../utils/constants';
import { User } from '../users/entities/user.entity';

@Injectable()
export class SessionsService {
  private readonly maxSessions: number;

  constructor(
    @InjectRepository(UserSession)
    private sessionRepo: Repository<UserSession>,
    private config: ConfigService,
  ) {
    this.maxSessions = this.config.get<number>('maxConcurrentSessions', 3);
  }

  async create(
    userId: string,
    refreshToken: string,
    ipAddress?: string,
    userAgent?: string,
  ): Promise<UserSession> {
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + REFRESH_TOKEN_EXPIRY_DAYS);

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
      refreshTokenHash: hashToken(refreshToken),
      ipAddress: ipAddress || null,
      userAgent: userAgent || null,
      expiresAt,
    });
    return this.sessionRepo.save(session);
  }

  /** Create session placeholder; caller sets refresh token hash after generating JWT. */
  async createPlaceholder(
    userId: string,
    ipAddress?: string,
    userAgent?: string,
  ): Promise<UserSession> {
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + REFRESH_TOKEN_EXPIRY_DAYS);

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
      refreshTokenHash: hashToken('pending'),
      ipAddress: ipAddress || null,
      userAgent: userAgent || null,
      expiresAt,
    });
    return this.sessionRepo.save(session);
  }

  async setRefreshTokenHash(sessionId: string, refreshToken: string): Promise<void> {
    await this.sessionRepo.update(
      { sessionId },
      { refreshTokenHash: hashToken(refreshToken) },
    );
  }

  async findBySessionId(sessionId: string): Promise<UserSession | null> {
    return this.sessionRepo.findOne({
      where: { sessionId, isActive: true },
      relations: ['user', 'user.role'],
    });
  }

  async validateRefreshToken(sessionId: string, refreshToken: string): Promise<User | null> {
    const session = await this.sessionRepo.findOne({
      where: { sessionId, isActive: true },
      relations: ['user', 'user.role'],
    });
    if (!session || session.expiresAt < new Date()) return null;
    const hash = hashToken(refreshToken);
    if (session.refreshTokenHash !== hash) return null;
    session.lastActivity = new Date();
    await this.sessionRepo.save(session);
    return session.user;
  }

  async revokeSession(sessionId: string, userId: string): Promise<boolean> {
    const session = await this.sessionRepo.findOne({
      where: { sessionId, userId },
    });
    if (!session) return false;
    session.isActive = false;
    await this.sessionRepo.save(session);
    return true;
  }

  async revokeAllForUser(userId: string): Promise<void> {
    await this.sessionRepo.update({ userId }, { isActive: false });
  }

  async getActiveSessions(userId: string, currentSessionId?: string) {
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

  async cleanupExpired(): Promise<number> {
    const result = await this.sessionRepo.delete({
      expiresAt: LessThan(new Date()),
    });
    return result.affected ?? 0;
  }
}
