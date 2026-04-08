import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuditLog } from './entities/audit-log.entity';

export interface AuditLogInput {
  userId?: string | null;
  action: string;
  entityType: string;
  entityId?: string | null;
  oldValues?: Record<string, unknown> | null;
  newValues?: Record<string, unknown> | null;
  ipAddress?: string | null;
  userAgent?: string | null;
  status: 'SUCCESS' | 'FAILED';
  errorMessage?: string | null;
}

@Injectable()
export class AuditService {
  constructor(
    @InjectRepository(AuditLog)
    private auditRepo: Repository<AuditLog>,
  ) {}

  async log(input: AuditLogInput): Promise<AuditLog> {
    const log = this.auditRepo.create({
      userId: input.userId ?? null,
      action: input.action,
      entityType: input.entityType,
      entityId: input.entityId ?? null,
      oldValues: input.oldValues ?? null,
      newValues: input.newValues ?? null,
      ipAddress: input.ipAddress ?? null,
      userAgent: input.userAgent ?? null,
      status: input.status,
      errorMessage: input.errorMessage ?? null,
    });
    return this.auditRepo.save(log);
  }

  async findPaginated(params: {
    userId?: string;
    action?: string;
    entityType?: string;
    startDate?: Date;
    endDate?: Date;
    page?: number;
    limit?: number;
  }) {
    const { userId, action, entityType, startDate, endDate, page = 1, limit = 50 } = params;
    const qb = this.auditRepo
      .createQueryBuilder('a')
      .leftJoinAndSelect('a.user', 'u')
      .orderBy('a.createdDate', 'DESC');

    if (userId) qb.andWhere('a.userId = :userId', { userId });
    if (action) qb.andWhere('a.action = :action', { action });
    if (entityType) qb.andWhere('a.entityType = :entityType', { entityType });
    if (startDate) qb.andWhere('a.createdDate >= :startDate', { startDate });
    if (endDate) qb.andWhere('a.createdDate <= :endDate', { endDate });

    const total = await qb.getCount();
    const data = await qb
      .skip((page - 1) * limit)
      .take(limit)
      .getMany();

    return {
      data,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}
