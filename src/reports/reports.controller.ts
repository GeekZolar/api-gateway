import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { PermissionsGuard } from '../common/guards/permissions.guard';
import { RequirePermissions } from '../common/decorators/permissions.decorator';
import { ReportsService } from './reports.service';
import { ExportReportDto } from './dto/export-report.dto';

@ApiTags('reports')
@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('current-inventory')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @ApiBearerAuth()
  @RequirePermissions('reports.read')
  @ApiOperation({ summary: 'Current inventory report' })
  @ApiResponse({ status: 200, description: 'Inventory snapshot' })
  getCurrentInventory() {
    return this.reportsService.getCurrentInventory();
  }

  @Get('valuation')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @ApiBearerAuth()
  @RequirePermissions('reports.read')
  @ApiOperation({ summary: 'Inventory valuation report' })
  @ApiResponse({ status: 200, description: 'Valuation by SKU/warehouse' })
  getValuation() {
    return this.reportsService.getValuation();
  }

  @Get('variance')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @ApiBearerAuth()
  @RequirePermissions('reports.read')
  @ApiOperation({ summary: 'Reconciliation variance report' })
  @ApiResponse({ status: 200, description: 'Book vs physical variance' })
  getVariance() {
    return this.reportsService.getVariance();
  }

  @Post('export')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @ApiBearerAuth()
  @RequirePermissions('reports.export')
  @ApiOperation({ summary: 'Export report' })
  @ApiResponse({ status: 200, description: 'Export job queued' })
  export(@Body() dto: ExportReportDto) {
    return this.reportsService.exportReport(dto.type, dto.format, dto.filters);
  }
}
