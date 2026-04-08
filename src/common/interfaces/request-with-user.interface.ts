import { Request } from 'express';

export interface JwtPayload {
  sub: string;
  username: string;
  email: string;
  role: string;
  permissions: Record<string, string[]>;
  sessionId: string;
  iat: number;
  exp: number;
}

export interface RequestWithUser extends Request {
  user: {
    userId: string;
    username: string;
    email: string;
    role: string;
    permissions: Record<string, string[]>;
    sessionId: string;
  };
  correlationId?: string;
  oldValues?: Record<string, unknown>;
}
