import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { PermissionsGuard } from '../common/guards/permissions.guard';
import { RequirePermissions } from '../common/decorators/permissions.decorator';
import { ReportsService } from '../reports/reports.service';

@ApiTags('dashboard')
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('summary')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @ApiBearerAuth()
  @RequirePermissions('dashboard.read')
  @ApiOperation({ summary: 'Dashboard KPIs summary' })
  @ApiResponse({ status: 200, description: 'KPIs (stockouts, turns, value, alerts)' })
  getSummary() {
    return this.reportsService.getDashboardSummary();
  }
}
