import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { RolesService } from './roles.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { RequirePermissions } from '../../common/decorators/permissions.decorator';
import { Public } from '../../common/decorators/public.decorator';

@ApiTags('roles')
@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Get('registration')
  @Public()
  @ApiOperation({ summary: 'List roles available for registration (public)' })
  async listForRegistration() {
    return this.rolesService.findForRegistration();
  }

  @Get()
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('roles.read')
  @ApiOperation({ summary: 'List all roles' })
  async findAll() {
    return this.rolesService.findAll();
  }

  @Get(':roleId')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('roles.read')
  @ApiOperation({ summary: 'Get role by ID' })
  async findOne(@Param('roleId') roleId: string) {
    return this.rolesService.findOne(roleId);
  }
}
