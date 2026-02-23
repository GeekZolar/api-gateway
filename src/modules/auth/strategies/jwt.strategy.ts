import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { JwtPayload } from '../../../common/interfaces/request-with-user.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.get<string>('jwt.accessSecret') || process.env.JWT_ACCESS_SECRET,
    });
  }

  validate(payload: JwtPayload & { type?: string }) {
    if (payload.type === 'mfa-verification') {
      throw new UnauthorizedException(
        'This endpoint requires an access token. Complete MFA verification first: POST /auth/mfa/verify-login with mfaToken and mfaCode to get an access token.',
      );
    }
    if (!payload.sub || !payload.sessionId) {
      throw new UnauthorizedException('Invalid or expired token');
    }
    return {
      userId: payload.sub,
      username: payload.username,
      email: payload.email,
      role: payload.role,
      permissions: payload.permissions || {},
      sessionId: payload.sessionId,
    };
  }
}
