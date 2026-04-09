import { Injectable, Inject } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

interface JwtPayload {
  sub: string;
  username: string;
  email: string;
  role: string;
  permissions: Record<string, string[]>;
  sessionId: string;
  iat: number;
  exp: number;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(@Inject(ConfigService) config: ConfigService) {
    const secret = config.get<string>('jwtSecret') || process.env.JWT_ACCESS_SECRET;
    if (!secret) {
      throw new Error('JWT secret is not set (JWT_ACCESS_SECRET or jwtSecret)');
    }
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: secret,
    });
  }

  validate(payload: JwtPayload) {
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
