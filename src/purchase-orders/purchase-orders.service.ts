import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PurchaseOrder } from './entities/purchase-order.entity';
import { PurchaseOrderLine } from './entities/purchase-order-line.entity';
import { Supplier } from './entities/supplier.entity';
import { Product } from '../inventory/entities/product.entity';
import { ListPurchaseOrdersDto } from './dto/list-purchase-orders.dto';
import { CreatePurchaseOrderDto } from './dto/create-purchase-order.dto';
import { ReceivePurchaseOrderDto } from './dto/receive-purchase-order.dto';

@Injectable()
export class PurchaseOrdersService {
  constructor(
    @InjectRepository(PurchaseOrder)
    private readonly poRepo: Repository<PurchaseOrder>,
    @InjectRepository(PurchaseOrderLine)
    private readonly lineRepo: Repository<PurchaseOrderLine>,
    @InjectRepository(Supplier)
    private readonly supplierRepo: Repository<Supplier>,
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
  ) {}

  async list(dto: ListPurchaseOrdersDto) {
    const page = dto.page ?? 1;
    const pageSize = dto.pageSize ?? 20;
    const qb = this.poRepo
      .createQueryBuilder('po')
      .leftJoinAndSelect('po.supplier', 'supplier')
      .leftJoinAndSelect('po.warehouse', 'warehouse')
      .leftJoinAndSelect('po.lines', 'lines')
      .leftJoinAndSelect('lines.product', 'product');
    if (dto.supplierId) qb.andWhere('po.supplier_id = :supplierId', { supplierId: dto.supplierId });
    if (dto.warehouseId) qb.andWhere('po.warehouse_id = :warehouseId', { warehouseId: dto.warehouseId });
    if (dto.status) qb.andWhere('po.status = :status', { status: dto.status });
    if (dto.fromDate) qb.andWhere('po.expected_date >= :fromDate', { fromDate: dto.fromDate });
    if (dto.toDate) qb.andWhere('po.expected_date <= :toDate', { toDate: dto.toDate });
    qb.orderBy('po.created_at', 'DESC');
    const [items, total] = await qb
      .skip((page - 1) * pageSize)
      .take(pageSize)
      .getManyAndCount();
    return { items, total, page, pageSize };
  }

  async create(dto: CreatePurchaseOrderDto, userId?: string) {
    const supplier = await this.supplierRepo.findOne({ where: { id: dto.supplierId } });
    if (!supplier) throw new NotFoundException('Supplier not found');
    const poNumber = `PO-${Date.now()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
    const po = this.poRepo.create({
      poNumber,
      supplierId: dto.supplierId,
      warehouseId: dto.warehouseId,
      expectedDate: dto.expectedDate,
      status: 'draft',
    });
    const savedPo = await this.poRepo.save(po);
    for (const line of dto.lines) {
      let productId = line.productId;
      if (!productId && line.sku) {
        const product = await this.productRepo.findOne({ where: { sku: line.sku } });
        if (!product) throw new BadRequestException(`Product SKU ${line.sku} not found`);
        productId = product.id;
      }
      if (!productId) throw new BadRequestException('Each line must have productId or sku');
      const pol = this.lineRepo.create({
        purchaseOrderId: savedPo.id,
        productId,
        orderedQty: line.orderedQty,
        unitCost: line.unitCost ?? 0,
      });
      await this.lineRepo.save(pol);
    }
    return this.poRepo.findOne({
      where: { id: savedPo.id },
      relations: ['supplier', 'warehouse', 'lines', 'lines.product'],
    });
  }

  async approve(id: string, userId: string, _comment?: string) {
    const po = await this.poRepo.findOne({ where: { id } });
    if (!po) throw new NotFoundException('Purchase order not found');
    if (po.status !== 'draft' && po.status !== 'pending_approval') {
      throw new BadRequestException(`Cannot approve PO in status ${po.status}`);
    }
    po.status = 'approved';
    po.approvedAt = new Date();
    po.approvedByUserId = userId;
    await this.poRepo.save(po);
    return this.poRepo.findOne({
      where: { id },
      relations: ['supplier', 'warehouse', 'lines', 'lines.product'],
    });
  }

  async receive(id: string, dto: ReceivePurchaseOrderDto, userId?: string) {
    const po = await this.poRepo.findOne({ where: { id }, relations: ['lines'] });
    if (!po) throw new NotFoundException('Purchase order not found');
    if (po.status !== 'approved') throw new BadRequestException('PO must be approved before receiving');
    for (const rec of dto.lines) {
      const line = await this.lineRepo.findOne({ where: { id: rec.poLineId } });
      if (!line || line.purchaseOrderId !== id) throw new NotFoundException(`PO line ${rec.poLineId} not found`);
      line.receivedQty = Number(line.receivedQty) + rec.receivedQty;
      await this.lineRepo.save(line);
    }
    const allLines = await this.lineRepo.find({ where: { purchaseOrderId: id } });
    const allReceived = allLines.every((l) => Number(l.receivedQty) >= Number(l.orderedQty));
    if (allReceived) {
      po.status = 'received';
      await this.poRepo.save(po);
    }
    return this.poRepo.findOne({
      where: { id },
      relations: ['supplier', 'warehouse', 'lines', 'lines.product'],
    });
  }

  async getReplenishmentRecommendations(warehouseId?: string, sku?: string) {
    // Stub: return empty or placeholder; real impl would use min/max, forecast, lead time
    return {
      warehouseId: warehouseId ?? null,
      sku: sku ?? null,
      recommendations: [],
      message: 'Replenishment recommendations (stub). Implement using inventory levels and forecast.',
    };
  }
}
