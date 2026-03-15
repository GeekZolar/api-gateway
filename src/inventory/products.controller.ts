import { Controller, Get, Post, Body, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../proxy/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { InventoryService } from './inventory.service';
import { CreateProductDto } from './dto/create-product.dto';

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

@ApiTags('products')
@Controller('products')
@UseGuards(JwtAuthGuard)
export class ProductsController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Get()
  @UseGuards(RolesGuard)
  @Roles(...ALL_INVENTORY_ROLES)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'List all products' })
  @ApiResponse({ status: 200, description: 'List of products' })
  list() {
    return this.inventoryService.listProducts();
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(RolesGuard)
  @Roles(...EDIT_ROLES)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a product' })
  @ApiResponse({ status: 201, description: 'Product created' })
  @ApiResponse({ status: 409, description: 'Product SKU already exists' })
  create(@Body() dto: CreateProductDto) {
    return this.inventoryService.createProduct(dto);
  }
}
