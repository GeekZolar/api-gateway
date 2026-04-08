import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { UtilityService } from './utility.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { RequirePermissions } from '../../common/decorators/permissions.decorator';

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
}
