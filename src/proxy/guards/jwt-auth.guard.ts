import { Injectable, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }

  handleRequest<TUser = unknown>(err: Error | null, user: TUser): TUser {
    if (err || !user) {
      const message =
        err && (err as Error & { name?: string }).name === 'TokenExpiredError'
          ? 'Token has expired; use POST /auth/refresh or login again'
          : 'Invalid or expired token';
      throw new UnauthorizedException(message);
    }
    return user;
  }
}
