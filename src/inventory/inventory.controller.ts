import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { PermissionsGuard } from '../common/guards/permissions.guard';
import { RequirePermissions } from '../common/decorators/permissions.decorator';
import { InventoryService } from './inventory.service';
import { FilterInventoryDto } from './dto/filter-inventory.dto';
import { AdjustInventoryDto } from './dto/adjust-inventory.dto';
import { CreateTransferDto } from './dto/create-transfer.dto';
import { ExpiringQueryDto } from './dto/expiring-query.dto';

@ApiTags('inventory')
@Controller('inventory')
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Get()
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @ApiBearerAuth()
  @RequirePermissions('inventory.read')
  @ApiOperation({ summary: 'List inventory with filters' })
  @ApiResponse({ status: 200, description: 'Paginated inventory list' })
  list(@Query() dto: FilterInventoryDto, @Req() req: { user?: { userId?: string } }) {
    return this.inventoryService.list(dto, req.user?.userId);
  }

  @Get('expiring')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @ApiBearerAuth()
  @RequirePermissions('inventory.read')
  @ApiOperation({ summary: 'Get expiring inventory within window' })
  @ApiResponse({ status: 200, description: 'List of expiring items' })
  expiring(@Query() dto: ExpiringQueryDto) {
    return this.inventoryService.getExpiring(dto.days ?? 120, dto.warehouseId);
  }

  @Get(':sku')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @ApiBearerAuth()
  @RequirePermissions('inventory.read')
  @ApiOperation({ summary: 'Get inventory details by SKU' })
  @ApiResponse({ status: 200, description: 'SKU details by location' })
  @ApiResponse({ status: 404, description: 'SKU not found' })
  getBySku(@Param('sku') sku: string) {
    return this.inventoryService.getBySku(sku);
  }

  @Post('adjust')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @ApiBearerAuth()
  @RequirePermissions('inventory.update')
  @ApiOperation({ summary: 'Create inventory adjustment' })
  @ApiResponse({ status: 200, description: 'Adjustment applied' })
  @ApiResponse({ status: 403, description: 'Insufficient permissions' })
  adjust(@Body() dto: AdjustInventoryDto, @Req() req: { user?: { userId?: string } }) {
    return this.inventoryService.adjust(dto, req.user?.userId);
  }

  @Post('transfer')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @ApiBearerAuth()
  @RequirePermissions('inventory.update')
  @ApiOperation({ summary: 'Create stock transfer between warehouses' })
  @ApiResponse({ status: 201, description: 'Transfer created' })
  @ApiResponse({ status: 403, description: 'Insufficient permissions' })
  createTransfer(@Body() dto: CreateTransferDto, @Req() req: { user?: { userId?: string } }) {
    return this.inventoryService.createTransfer(dto, req.user?.userId);
  }
}
