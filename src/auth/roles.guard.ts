import { CanActivate, ExecutionContext, Injectable, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY, AppRole } from './roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<AppRole[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles?.length) return true;

    const request = context.switchToHttp().getRequest();
    const user = request.user as { role?: string } | undefined;
    if (!user?.role) throw new ForbiddenException('Missing user role');

    const role = (user.role as string).toLowerCase().replace(/\s+/g, '-') as AppRole;
    const normalized = (role === 'user' ? 'read-only' : role) as AppRole;

    if (!requiredRoles.includes(normalized)) {
      throw new ForbiddenException('Insufficient permissions');
    }
    return true;
  }
}
