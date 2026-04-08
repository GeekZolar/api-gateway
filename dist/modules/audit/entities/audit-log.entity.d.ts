import { User } from '../../users/entities/user.entity';
export declare class AuditLog {
    auditId: string;
    userId: string | null;
    user: User | null;
    action: string;
    entityType: string;
    entityId: string | null;
    oldValues: Record<string, unknown> | null;
    newValues: Record<string, unknown> | null;
    ipAddress: string | null;
    userAgent: string | null;
    status: 'SUCCESS' | 'FAILED';
    errorMessage: string | null;
    createdDate: Date;
}
