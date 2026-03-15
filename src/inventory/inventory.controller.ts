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
import { JwtAuthGuard } from '../proxy/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { InventoryService } from './inventory.service';
import { FilterInventoryDto } from './dto/filter-inventory.dto';
import { AdjustInventoryDto } from './dto/adjust-inventory.dto';
import { CreateTransferDto } from './dto/create-transfer.dto';
import { ExpiringQueryDto } from './dto/expiring-query.dto';

const ALL_INVENTORY_ROLES: Parameters<typeof Roles>[0] = [
  'admin',
  'inventory-manager',
  'po-creator',
  'po-approver',
  'forecast-editor',
  'read-only',
  'user',
];
const EDIT_INVENTORY_ROLES: Parameters<typeof Roles>[0] = ['admin', 'inventory-manager'];

@ApiTags('inventory')
@Controller('inventory')
@UseGuards(JwtAuthGuard)
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Get()
  @UseGuards(RolesGuard)
  @Roles(...ALL_INVENTORY_ROLES)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'List inventory with filters' })
  @ApiResponse({ status: 200, description: 'Paginated inventory list' })
  list(@Query() dto: FilterInventoryDto, @Req() req: { user?: { userId?: string } }) {
    return this.inventoryService.list(dto, req.user?.userId);
  }

  @Get('expiring')
  @UseGuards(RolesGuard)
  @Roles(...ALL_INVENTORY_ROLES)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get expiring inventory within window' })
  @ApiResponse({ status: 200, description: 'List of expiring items' })
  expiring(@Query() dto: ExpiringQueryDto) {
    return this.inventoryService.getExpiring(dto.days ?? 120, dto.warehouseId);
  }

  @Get(':sku')
  @UseGuards(RolesGuard)
  @Roles(...ALL_INVENTORY_ROLES)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get inventory details by SKU' })
  @ApiResponse({ status: 200, description: 'SKU details by location' })
  @ApiResponse({ status: 404, description: 'SKU not found' })
  getBySku(@Param('sku') sku: string) {
    return this.inventoryService.getBySku(sku);
  }

  @Post('adjust')
  @UseGuards(RolesGuard)
  @Roles(...EDIT_INVENTORY_ROLES)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create inventory adjustment' })
  @ApiResponse({ status: 200, description: 'Adjustment applied' })
  @ApiResponse({ status: 403, description: 'Insufficient permissions' })
  adjust(@Body() dto: AdjustInventoryDto, @Req() req: { user?: { userId?: string } }) {
    return this.inventoryService.adjust(dto, req.user?.userId);
  }

  @Post('transfer')
  @UseGuards(RolesGuard)
  @Roles(...EDIT_INVENTORY_ROLES)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create stock transfer between warehouses' })
  @ApiResponse({ status: 201, description: 'Transfer created' })
  @ApiResponse({ status: 403, description: 'Insufficient permissions' })
  createTransfer(@Body() dto: CreateTransferDto, @Req() req: { user?: { userId?: string } }) {
    return this.inventoryService.createTransfer(dto, req.user?.userId);
  }
}
