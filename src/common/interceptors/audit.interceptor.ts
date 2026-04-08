import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { Reflector } from '@nestjs/core';
import { AUDIT_KEY, AuditOptions } from '../decorators/audit.decorator';
import { AuditService } from '../../modules/audit/audit.service';
import { RequestWithUser } from '../interfaces/request-with-user.interface';

@Injectable()
export class AuditInterceptor implements NestInterceptor {
  constructor(
    private readonly auditService: AuditService,
    private reflector: Reflector,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const auditOpts = this.reflector.get<AuditOptions | undefined>(
      AUDIT_KEY,
      context.getHandler(),
    );
    if (!auditOpts) return next.handle();

    const request = context.switchToHttp().getRequest<RequestWithUser>();
    const user = request.user;
    const entityId = auditOpts.entityIdParam
      ? request.params?.[auditOpts.entityIdParam]
      : request.params?.id;

    return next.handle().pipe(
      tap(async (response) => {
        await this.auditService.log({
          userId: user?.userId,
          action: auditOpts.action,
          entityType: auditOpts.entityType,
          entityId: entityId || undefined,
          oldValues: request.oldValues,
          newValues: response as Record<string, unknown>,
          ipAddress: request.ip,
          userAgent: request.headers['user-agent'],
          status: 'SUCCESS',
        });
      }),
      catchError(async (error) => {
        await this.auditService.log({
          userId: user?.userId,
          action: auditOpts.action,
          entityType: auditOpts.entityType,
          entityId: entityId || undefined,
          status: 'FAILED',
          errorMessage: error?.message,
          ipAddress: request.ip,
          userAgent: request.headers['user-agent'],
        });
        throw error;
      }),
    );
  }
}
