import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../proxy/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { ReportsService } from './reports.service';
import { ExportReportDto } from './dto/export-report.dto';

const ROLES: Parameters<typeof Roles>[0] = ['admin', 'inventory-manager', 'po-creator', 'po-approver', 'forecast-editor', 'read-only', 'user'];

@ApiTags('reports')
@Controller('reports')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(...ROLES)
@ApiBearerAuth()
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('current-inventory')
  @ApiOperation({ summary: 'Current inventory report' })
  @ApiResponse({ status: 200, description: 'Inventory snapshot' })
  getCurrentInventory() {
    return this.reportsService.getCurrentInventory();
  }

  @Get('valuation')
  @ApiOperation({ summary: 'Inventory valuation report' })
  @ApiResponse({ status: 200, description: 'Valuation by SKU/warehouse' })
  getValuation() {
    return this.reportsService.getValuation();
  }

  @Get('variance')
  @ApiOperation({ summary: 'Reconciliation variance report' })
  @ApiResponse({ status: 200, description: 'Book vs physical variance' })
  getVariance() {
    return this.reportsService.getVariance();
  }

  @Post('export')
  @ApiOperation({ summary: 'Export report' })
  @ApiResponse({ status: 200, description: 'Export job queued' })
  export(@Body() dto: ExportReportDto) {
    return this.reportsService.exportReport(dto.type, dto.format, dto.filters);
  }
}
