import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { PurchaseOrdersService } from '../purchase-orders/purchase-orders.service';
import { ReplenishmentQueryDto } from '../purchase-orders/dto/replenishment-query.dto';

const ROLES: Parameters<typeof Roles>[0] = ['admin', 'inventory-manager', 'forecast-editor'];

@ApiTags('recommendations')
@Controller('recommendations')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(...ROLES)
@ApiBearerAuth()
export class RecommendationsController {
  constructor(private readonly purchaseOrdersService: PurchaseOrdersService) {}

  @Get('replenishment')
  @ApiOperation({ summary: 'Get replenishment recommendations' })
  @ApiResponse({ status: 200, description: 'Recommendations list' })
  getReplenishment(@Query() dto: ReplenishmentQueryDto) {
    return this.purchaseOrdersService.getReplenishmentRecommendations(dto.warehouseId, dto.sku);
  }
}
