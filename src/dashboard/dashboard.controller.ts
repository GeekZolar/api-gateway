import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../proxy/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { ReportsService } from '../reports/reports.service';

const ROLES: Parameters<typeof Roles>[0] = ['admin', 'inventory-manager', 'po-creator', 'po-approver', 'forecast-editor', 'read-only', 'user'];

@ApiTags('dashboard')
@Controller('dashboard')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(...ROLES)
@ApiBearerAuth()
export class DashboardController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('summary')
  @ApiOperation({ summary: 'Dashboard KPIs summary' })
  @ApiResponse({ status: 200, description: 'KPIs (stockouts, turns, value, alerts)' })
  getSummary() {
    return this.reportsService.getDashboardSummary();
  }
}
