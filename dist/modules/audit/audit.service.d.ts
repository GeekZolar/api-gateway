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
export declare class AuditService {
    private auditRepo;
    constructor(auditRepo: Repository<AuditLog>);
    log(input: AuditLogInput): Promise<AuditLog>;
    findPaginated(params: {
        userId?: string;
        action?: string;
        entityType?: string;
        startDate?: Date;
        endDate?: Date;
        page?: number;
        limit?: number;
    }): Promise<{
        data: AuditLog[];
        meta: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
}
