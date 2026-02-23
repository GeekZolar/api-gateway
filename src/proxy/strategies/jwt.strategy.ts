import { Injectable } from '@nestjs/common';
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
  constructor(config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.get<string>('jwtSecret') || process.env.JWT_ACCESS_SECRET,
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
