import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  Query,
  Req,
  UseGuards,
  HttpCode,
  HttpStatus,
  UnauthorizedException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { PermissionsGuard } from '../common/guards/permissions.guard';
import { RequirePermissions } from '../common/decorators/permissions.decorator';
import { PurchaseOrdersService } from './purchase-orders.service';
import { ListPurchaseOrdersDto } from './dto/list-purchase-orders.dto';
import { CreatePurchaseOrderDto } from './dto/create-purchase-order.dto';
import { ApprovePurchaseOrderDto } from './dto/approve-purchase-order.dto';
import { ReceivePurchaseOrderDto } from './dto/receive-purchase-order.dto';

@ApiTags('purchase-orders')
@Controller('purchase-orders')
export class PurchaseOrdersController {
  constructor(private readonly purchaseOrdersService: PurchaseOrdersService) {}

  @Get()
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @ApiBearerAuth()
  @RequirePermissions('purchaseOrders.read')
  @ApiOperation({ summary: 'List purchase orders' })
  @ApiResponse({ status: 200, description: 'Paginated list' })
  list(@Query() dto: ListPurchaseOrdersDto) {
    return this.purchaseOrdersService.list(dto);
  }

  @Post()
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @ApiBearerAuth()
  @RequirePermissions('purchaseOrders.create')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create purchase order' })
  @ApiResponse({ status: 201, description: 'PO created' })
  create(@Body() dto: CreatePurchaseOrderDto, @Req() req: { user?: { userId?: string } }) {
    const userId = req.user?.userId;
    if (!userId) throw new UnauthorizedException('Authentication required');
    return this.purchaseOrdersService.create(dto, userId);
  }

  @Put(':id/approve')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @ApiBearerAuth()
  @RequirePermissions('purchaseOrders.approve')
  @ApiOperation({ summary: 'Approve purchase order' })
  @ApiResponse({ status: 200, description: 'PO approved' })
  approve(
    @Param('id') id: string,
    @Body() dto: ApprovePurchaseOrderDto,
    @Req() req: { user: { userId: string } }) {
    return this.purchaseOrdersService.approve(id, req.user.userId, dto.comment);
  }

  @Post(':id/receive')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @ApiBearerAuth()
  @RequirePermissions('purchaseOrders.update')
  @ApiOperation({ summary: 'Record PO receipt' })
  @ApiResponse({ status: 200, description: 'Receipt recorded' })
  receive(
    @Param('id') id: string,
    @Body() dto: ReceivePurchaseOrderDto,
    @Req() req: { user?: { userId?: string } }) {
    return this.purchaseOrdersService.receive(id, dto, req.user?.userId);
  }
}
