import {
  Controller,
  Get,
  Logger,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('root')
@Controller()
export class ProxyController {
  private readonly logger = new Logger(ProxyController.name);

  @Get()
  @ApiOperation({ summary: 'Service info and endpoint list' })
  @ApiResponse({ status: 200, description: 'Gateway info' })
  root() {
    this.logger.log('Root endpoint hit');
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
}
