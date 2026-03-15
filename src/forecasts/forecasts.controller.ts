import { Controller, Get, Post, Put, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../proxy/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { ForecastsService } from './forecasts.service';
import { ForecastQueryDto } from './dto/forecast-query.dto';
import { GenerateForecastsDto } from './dto/generate-forecasts.dto';
import { OverrideForecastDto } from './dto/override-forecast.dto';
import { AccuracyQueryDto } from './dto/accuracy-query.dto';

const FORECAST_READ: Parameters<typeof Roles>[0] = ['admin', 'inventory-manager', 'forecast-editor'];
const FORECAST_EDIT: Parameters<typeof Roles>[0] = ['admin', 'forecast-editor'];

@ApiTags('forecasts')
@Controller('forecasts')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ForecastsController {
  constructor(private readonly forecastsService: ForecastsService) {}

  @Get('accuracy')
  @UseGuards(RolesGuard)
  @Roles(...FORECAST_EDIT)
  @ApiOperation({ summary: 'Forecast accuracy metrics' })
  @ApiResponse({ status: 200, description: 'Accuracy metrics' })
  getAccuracy(@Query() dto: AccuracyQueryDto) {
    return this.forecastsService.getAccuracy(dto.from, dto.to, dto.sku, dto.warehouseId);
  }

  @Post('generate')
  @UseGuards(RolesGuard)
  @Roles(...FORECAST_EDIT)
  @ApiOperation({ summary: 'Trigger forecast generation job' })
  @ApiResponse({ status: 200, description: 'Job started' })
  generate(@Body() dto: GenerateForecastsDto) {
    return this.forecastsService.generate(dto);
  }

  @Get(':sku')
  @UseGuards(RolesGuard)
  @Roles(...FORECAST_READ)
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
  @UseGuards(RolesGuard)
  @Roles(...FORECAST_EDIT)
  @ApiOperation({ summary: 'Override forecast for SKU' })
  @ApiResponse({ status: 200, description: 'Override applied' })
  @ApiResponse({ status: 404, description: 'SKU or forecast not found' })
  override(@Param('sku') sku: string, @Body() dto: OverrideForecastDto) {
    return this.forecastsService.override(sku, dto);
  }
}
