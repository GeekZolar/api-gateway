import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

const ROLES = [
  { id: 'user', name: 'User' },
  { id: 'admin', name: 'Admin' },
  { id: 'inventory-manager', name: 'Inventory Manager' },
  { id: 'po-creator', name: 'PO Creator' },
  { id: 'po-approver', name: 'PO Approver' },
  { id: 'forecast-editor', name: 'Forecast Editor' },
  { id: 'read-only', name: 'Read-Only User' },
];

@ApiTags('roles')
@Controller('roles')
export class RolesController {
  @Get()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'List all roles (authenticated)' })
  @ApiResponse({ status: 200, description: 'List of roles' })
  @UseGuards(JwtAuthGuard)
  findAll() {
    return ROLES;
  }

  @Get('registration')
  @ApiOperation({ summary: 'List roles for registration (public)' })
  @ApiResponse({ status: 200, description: 'List of roles' })
  registration() {
    return ROLES;
  }
}
