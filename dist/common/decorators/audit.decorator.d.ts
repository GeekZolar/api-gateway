export declare const AUDIT_KEY = "audit";
export interface AuditOptions {
    action: string;
    entityType: string;
    entityIdParam?: string;
}
export declare const Audit: (options: AuditOptions) => import("@nestjs/common").CustomDecorator<string>;
