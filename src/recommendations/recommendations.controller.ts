import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { PermissionsGuard } from '../common/guards/permissions.guard';
import { RequirePermissions } from '../common/decorators/permissions.decorator';
import { PurchaseOrdersService } from '../purchase-orders/purchase-orders.service';
import { ReplenishmentQueryDto } from '../purchase-orders/dto/replenishment-query.dto';

@ApiTags('recommendations')
@Controller('recommendations')
export class RecommendationsController {
  constructor(private readonly purchaseOrdersService: PurchaseOrdersService) {}

  @Get('replenishment')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @ApiBearerAuth()
  @RequirePermissions('recommendations.read')
  @ApiOperation({ summary: 'Get replenishment recommendations' })
  @ApiResponse({ status: 200, description: 'Recommendations list' })
  getReplenishment(@Query() dto: ReplenishmentQueryDto) {
    return this.purchaseOrdersService.getReplenishmentRecommendations(dto.warehouseId, dto.sku);
  }
}
