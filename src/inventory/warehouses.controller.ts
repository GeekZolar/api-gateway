import { Controller, Get, Post, Body, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { InventoryService } from './inventory.service';
import { CreateWarehouseDto } from './dto/create-warehouse.dto';

const ALL_INVENTORY_ROLES: Parameters<typeof Roles>[0] = [
  'admin',
  'inventory-manager',
  'po-creator',
  'po-approver',
  'forecast-editor',
  'read-only',
  'user',
];
const EDIT_ROLES: Parameters<typeof Roles>[0] = ['admin', 'inventory-manager'];

@ApiTags('warehouses')
@Controller('warehouses')
@UseGuards(JwtAuthGuard)
export class WarehousesController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Get()
  @UseGuards(RolesGuard)
  @Roles(...ALL_INVENTORY_ROLES)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'List all warehouses' })
  @ApiResponse({ status: 200, description: 'List of warehouses' })
  list() {
    return this.inventoryService.listWarehouses();
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(RolesGuard)
  @Roles(...EDIT_ROLES)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a warehouse' })
  @ApiResponse({ status: 201, description: 'Warehouse created' })
  @ApiResponse({ status: 409, description: 'Warehouse code already exists' })
  create(@Body() dto: CreateWarehouseDto) {
    return this.inventoryService.createWarehouse(dto);
  }
}
