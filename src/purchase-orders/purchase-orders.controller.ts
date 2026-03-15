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
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../proxy/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { PurchaseOrdersService } from './purchase-orders.service';
import { ListPurchaseOrdersDto } from './dto/list-purchase-orders.dto';
import { CreatePurchaseOrderDto } from './dto/create-purchase-order.dto';
import { ApprovePurchaseOrderDto } from './dto/approve-purchase-order.dto';
import { ReceivePurchaseOrderDto } from './dto/receive-purchase-order.dto';

const PO_LIST_ROLES: Parameters<typeof Roles>[0] = ['admin', 'inventory-manager', 'po-creator', 'po-approver'];
const PO_CREATE_ROLES: Parameters<typeof Roles>[0] = ['admin', 'inventory-manager', 'po-creator'];
const PO_APPROVE_ROLES: Parameters<typeof Roles>[0] = ['admin', 'po-approver'];
const PO_RECEIVE_ROLES: Parameters<typeof Roles>[0] = ['admin', 'inventory-manager'];

@ApiTags('purchase-orders')
@Controller('purchase-orders')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class PurchaseOrdersController {
  constructor(private readonly purchaseOrdersService: PurchaseOrdersService) {}

  @Get()
  @UseGuards(RolesGuard)
  @Roles(...PO_LIST_ROLES)
  @ApiOperation({ summary: 'List purchase orders' })
  @ApiResponse({ status: 200, description: 'Paginated list' })
  list(@Query() dto: ListPurchaseOrdersDto) {
    return this.purchaseOrdersService.list(dto);
  }

  @Post()
  @UseGuards(RolesGuard)
  @Roles(...PO_CREATE_ROLES)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create purchase order' })
  @ApiResponse({ status: 201, description: 'PO created' })
  create(@Body() dto: CreatePurchaseOrderDto, @Req() req: { user?: { userId?: string } }) {
    return this.purchaseOrdersService.create(dto, req.user?.userId);
  }

  @Put(':id/approve')
  @UseGuards(RolesGuard)
  @Roles(...PO_APPROVE_ROLES)
  @ApiOperation({ summary: 'Approve purchase order' })
  @ApiResponse({ status: 200, description: 'PO approved' })
  approve(
    @Param('id') id: string,
    @Body() dto: ApprovePurchaseOrderDto,
    @Req() req: { user: { userId: string } }) {
    return this.purchaseOrdersService.approve(id, req.user.userId, dto.comment);
  }

  @Post(':id/receive')
  @UseGuards(RolesGuard)
  @Roles(...PO_RECEIVE_ROLES)
  @ApiOperation({ summary: 'Record PO receipt' })
  @ApiResponse({ status: 200, description: 'Receipt recorded' })
  receive(
    @Param('id') id: string,
    @Body() dto: ReceivePurchaseOrderDto,
    @Req() req: { user?: { userId?: string } }) {
    return this.purchaseOrdersService.receive(id, dto, req.user?.userId);
  }
}
