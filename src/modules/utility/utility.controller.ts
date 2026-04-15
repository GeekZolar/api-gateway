import { Body, Controller, Get, HttpCode, HttpStatus, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { UtilityService } from './utility.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { RequirePermissions } from '../../common/decorators/permissions.decorator';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@ApiTags('utility')
@Controller('utility')
export class UtilityController {
  constructor(private readonly utilityService: UtilityService) {}

  @Get('countries')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('inventory.read')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'List countries (snadb)' })
  countries() {
    return this.utilityService.findCountries();
  }

  @Get('categories')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('inventory.read')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'List categories (snadb)' })
  categories() {
    return this.utilityService.findCategories();
  }

  @Get('warehouses')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('inventory.read')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'List warehouses (snadb)' })
  warehouses() {
    return this.utilityService.findWarehouses();
  }

  @Get('suppliers')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('inventory.read')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'List suppliers (snadb)' })
  suppliers() {
    return this.utilityService.findSuppliers();
  }

  @Get('products')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('inventory.read')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'List products (snadb)' })
  products() {
    return this.utilityService.findProducts();
  }

  @Post('products')
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('inventory.create')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create product (snadb)' })
  @ApiResponse({ status: 201, description: 'Product created' })
  @ApiResponse({ status: 409, description: 'Product ID or SKU already exists' })
  createProduct(@Body() dto: CreateProductDto) {
    return this.utilityService.createProduct(dto);
  }

  @Patch('products/:productId')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('inventory.update')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update product (snadb)' })
  @ApiResponse({ status: 200, description: 'Product updated' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  @ApiResponse({ status: 409, description: 'Product SKU already exists' })
  updateProduct(@Param('productId') productId: string, @Body() dto: UpdateProductDto) {
    return this.utilityService.updateProduct(productId, dto);
  }
}
