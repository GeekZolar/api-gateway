import {
  Controller,
  All,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { Throttle } from '@nestjs/throttler';
import { ProxyService } from './proxy.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
function generateCorrelationId(): string {
  return typeof crypto !== 'undefined' && crypto.randomUUID
    ? crypto.randomUUID()
    : Date.now().toString(36) + Math.random().toString(36).slice(2);
}

const USER_SERVICE_PREFIX = '/api/v1';

@Controller()
export class ProxyController {
  private readonly logger = new Logger(ProxyController.name);

  constructor(private readonly proxy: ProxyService) {}

  @Get()
  root() {
    return {
      service: 'API Gateway',
      version: '1.0',
      prefix: '/api/v1',
      endpoints: {
        health: '/api/v1/health',
        auth: {
          login: 'POST /api/v1/auth/login',
          refresh: 'POST /api/v1/auth/refresh',
          logout: 'POST /api/v1/auth/logout',
          passwordReset: 'POST /api/v1/auth/password-reset/request',
        },
        users: 'POST /api/v1/users (register), GET/PATCH /api/v1/users (with auth)',
        roles: 'GET /api/v1/roles, GET /api/v1/roles/registration (public)',
      },
    };
  }

  @All('auth/login')
  @Throttle({ default: { limit: 5, ttl: 900000 } })
  async proxyLogin(@Req() req: Request, @Res() res: Response) {
    const correlationId = (req.headers['x-correlation-id'] as string) || generateCorrelationId();
    this.logger.log({ correlationId, method: req.method, path: req.path });
    return this.proxyRequest(req, res, 'user-management', false, correlationId);
  }

  @All('auth/refresh')
  async proxyRefresh(@Req() req: Request, @Res() res: Response) {
    const correlationId = (req.headers['x-correlation-id'] as string) || generateCorrelationId();
    return this.proxyRequest(req, res, 'user-management', false, correlationId);
  }

  @All('auth/password-reset/request')
  @All('auth/password-reset/confirm')
  async proxyPasswordReset(@Req() req: Request, @Res() res: Response) {
    const correlationId = (req.headers['x-correlation-id'] as string) || generateCorrelationId();
    return this.proxyRequest(req, res, 'user-management', false, correlationId);
  }

  @Post('users')
  async proxyUsersRegister(@Req() req: Request, @Res() res: Response) {
    const correlationId = (req.headers['x-correlation-id'] as string) || generateCorrelationId();
    return this.proxyRequest(req, res, 'user-management', false, correlationId);
  }

  @All('roles/registration')
  async proxyRolesRegistration(@Req() req: Request, @Res() res: Response) {
    const correlationId = (req.headers['x-correlation-id'] as string) || generateCorrelationId();
    return this.proxyRequest(req, res, 'user-management', false, correlationId);
  }

  @All('*')
  @UseGuards(JwtAuthGuard)
  async proxyAll(@Req() req: Request, @Res() res: Response) {
    const correlationId = (req.headers['x-correlation-id'] as string) || generateCorrelationId();
    this.logger.log({ correlationId, method: req.method, path: req.path });
    return this.proxyRequest(req, res, 'user-management', true, correlationId);
  }

  private async proxyRequest(
    req: Request,
    res: Response,
    serviceName: string,
    authRequired: boolean,
    correlationId: string,
  ) {
    const path = req.path.startsWith(USER_SERVICE_PREFIX) ? req.path : `${USER_SERVICE_PREFIX}${req.path}`;
    const query = req.url.includes('?') ? req.url.split('?')[1] : undefined;
    const headers: Record<string, string> = { ...(req.headers as Record<string, string>) };
    headers['x-correlation-id'] = correlationId;

    try {
      const response = await this.proxy.forward(
        serviceName,
        path,
        req.method,
        headers,
        req.body,
        query,
      ) as { status: number; headers: Record<string, string>; data: unknown };
      res.status(response.status).set(response.headers).json(response.data);
    } catch (err: any) {
      this.logger.error({ correlationId, error: err?.message });
      res.status(502).json({
        statusCode: 502,
        message: 'Bad Gateway',
        correlationId,
      });
    }
  }
}
