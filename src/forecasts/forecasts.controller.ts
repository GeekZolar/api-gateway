import { Controller, Get, Post, Put, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { PermissionsGuard } from '../common/guards/permissions.guard';
import { RequirePermissions } from '../common/decorators/permissions.decorator';
import { ForecastsService } from './forecasts.service';
import { ForecastQueryDto } from './dto/forecast-query.dto';
import { GenerateForecastsDto } from './dto/generate-forecasts.dto';
import { OverrideForecastDto } from './dto/override-forecast.dto';
import { AccuracyQueryDto } from './dto/accuracy-query.dto';

@ApiTags('forecasts')
@Controller('forecasts')
export class ForecastsController {
  constructor(private readonly forecastsService: ForecastsService) {}

  @Get('accuracy')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @ApiBearerAuth()
  @RequirePermissions('forecasts.update')
  @ApiOperation({ summary: 'Forecast accuracy metrics' })
  @ApiResponse({ status: 200, description: 'Accuracy metrics' })
  getAccuracy(@Query() dto: AccuracyQueryDto) {
    return this.forecastsService.getAccuracy(dto.from, dto.to, dto.sku, dto.warehouseId);
  }

  @Post('generate')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @ApiBearerAuth()
  @RequirePermissions('forecasts.create')
  @ApiOperation({ summary: 'Trigger forecast generation job' })
  @ApiResponse({ status: 200, description: 'Job started' })
  generate(@Body() dto: GenerateForecastsDto) {
    return this.forecastsService.generate(dto);
  }

  @Get(':sku')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @ApiBearerAuth()
  @RequirePermissions('forecasts.read')
  @ApiOperation({ summary: 'Get forecast for SKU' })
  @ApiResponse({ status: 200, description: 'Forecast data' })
  @ApiResponse({ status: 404, description: 'SKU not found' })
  getBySku(
    @Param('sku') sku: string,
    @Query() query: ForecastQueryDto,
  ) {
    return this.forecastsService.getBySku(sku, query.warehouseId, query.from, query.to);
  }

  @Put(':sku')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @ApiBearerAuth()
  @RequirePermissions('forecasts.update')
  @ApiOperation({ summary: 'Override forecast for SKU' })
  @ApiResponse({ status: 200, description: 'Override applied' })
  @ApiResponse({ status: 404, description: 'SKU or forecast not found' })
  override(@Param('sku') sku: string, @Body() dto: OverrideForecastDto) {
    return this.forecastsService.override(sku, dto);
  }
}
