import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PurchaseOrder } from './entities/purchase-order.entity';
import { PurchaseOrderLine } from './entities/purchase-order-line.entity';
import { Supplier } from '../modules/utility/entities/supplier.entity';
import { Product } from '../modules/utility/entities/product.entity';
import { ListPurchaseOrdersDto } from './dto/list-purchase-orders.dto';
import { CreatePurchaseOrderDto } from './dto/create-purchase-order.dto';
import { ReceivePurchaseOrderDto } from './dto/receive-purchase-order.dto';

function roundMoney(value: number): number {
  return Math.round(value * 100) / 100;
}

function approxEqualMoney(a: number, b: number, tolerance: number = 0.01): boolean {
  return Math.abs(roundMoney(a) - roundMoney(b)) <= tolerance;
}

function normalizeTaxRate(rate: number): number {
  if (Number.isNaN(rate) || rate < 0) return 0;
  // Accept 0-1 as decimal (e.g. 0.075), >1 as percent (e.g. 7.5)
  if (rate > 0 && rate <= 1) return rate * 100;
  return rate;
}

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
    if (dto.fromDate) qb.andWhere('po.purchase_order_date >= :fromDate', { fromDate: dto.fromDate });
    if (dto.toDate) qb.andWhere('po.purchase_order_date <= :toDate', { toDate: dto.toDate });
    // Use entity property names (not DB column names) so TypeORM can resolve metadata.
    qb.orderBy('po.createdDate', 'DESC');
    const [items, total] = await qb
      .skip((page - 1) * pageSize)
      .take(pageSize)
      .getManyAndCount();
    return { items, total, page, pageSize };
  }

  async create(dto: CreatePurchaseOrderDto, userId: string) {
    const supplier = await this.supplierRepo.findOne({ where: { supplierId: dto.supplierId } });
    if (!supplier) throw new NotFoundException('Supplier not found');
    if (!dto.lines?.length) throw new BadRequestException('At least one line is required');
    if (!dto.shippingMethod?.trim()) throw new BadRequestException('shippingMethod is required');
    if (!dto.currency?.trim()) throw new BadRequestException('currency is required');

    const poNumber = `PO-${Date.now()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;

    const resolvedLines: Array<{
      productId: string;
      orderedQty: number;
      unitCost: number;
      lineTotal: number;
      notes?: string;
    }> = [];

    for (const line of dto.lines) {
      if (!line.productId && !line.sku) {
        throw new BadRequestException('Each line must have productId or sku');
      }

      let product: Product | null = null;
      if (line.productId) {
        product = await this.productRepo.findOne({ where: { productId: line.productId } });
        if (!product) throw new BadRequestException(`Product ${line.productId} not found`);
      } else if (line.sku) {
        product = await this.productRepo.findOne({ where: { sku: line.sku } });
        if (!product) throw new BadRequestException(`Product SKU ${line.sku} not found`);
      }

      const productId = product!.productId;
      if (line.sku && product!.sku && line.sku !== product!.sku) {
        throw new BadRequestException(`Line SKU "${line.sku}" does not match product`);
      }

      const orderedQty = Number(line.orderedQty);
      const unitCost = Number(line.unitCost);
      if (Number.isNaN(orderedQty) || orderedQty <= 0) {
        throw new BadRequestException('Each line must have orderedQty > 0');
      }
      if (Number.isNaN(unitCost) || unitCost < 0) {
        throw new BadRequestException('Each line must have unitCost >= 0');
      }

      const lineTotal = roundMoney(orderedQty * unitCost);
      resolvedLines.push({
        productId,
        orderedQty,
        unitCost: roundMoney(unitCost),
        lineTotal,
        notes: line.notes,
      });
    }

    const computedSubTotal = roundMoney(resolvedLines.reduce((sum, l) => sum + l.lineTotal, 0));

    const inputSubTotal = roundMoney(Number(dto.subTotal));
    const inputTaxAmount = roundMoney(Number(dto.taxAmount ?? 0));
    const inputTotalValue = roundMoney(Number(dto.totalValue));

    if (!approxEqualMoney(inputSubTotal, computedSubTotal)) {
      throw new BadRequestException(
        `subTotal (${inputSubTotal}) must equal sum(lines) (${computedSubTotal})`,
      );
    }

    const includeTax = Boolean(dto.includeTax);
    const taxRatePct = normalizeTaxRate(Number(dto.taxRate ?? 0));
    if (includeTax && taxRatePct <= 0) {
      throw new BadRequestException('taxRate must be > 0 when includeTax is true');
    }
    if (!includeTax && inputTaxAmount !== 0) {
      throw new BadRequestException('taxAmount must be 0 when includeTax is false');
    }

    if (includeTax) {
      const expectedTax = roundMoney((inputSubTotal * taxRatePct) / 100);
      if (!approxEqualMoney(inputTaxAmount, expectedTax)) {
        throw new BadRequestException(
          `taxAmount (${inputTaxAmount}) must equal subTotal × taxRate (${expectedTax})`,
        );
      }
    }

    const expectedTotal = roundMoney(inputSubTotal + inputTaxAmount);
    if (!approxEqualMoney(inputTotalValue, expectedTotal)) {
      throw new BadRequestException(
        `totalValue (${inputTotalValue}) must equal subTotal + taxAmount (${expectedTotal})`,
      );
    }

    const savedId = await this.poRepo.manager.transaction(async (em) => {
      const po = em.create(PurchaseOrder, {
        poNumber,
        supplierId: dto.supplierId,
        warehouseId: dto.warehouseId,
        status: 'Draft',
        subTotal: String(inputSubTotal),
        includeTax,
        taxRate: String(taxRatePct),
        taxAmount: String(inputTaxAmount),
        shippingMethod: dto.shippingMethod,
        totalValue: String(inputTotalValue),
        currency: dto.currency,
        purchaseOrderDate: dto.purchaseOrderDate.slice(0, 10),
        dueDate: dto.dueDate ? dto.dueDate.slice(0, 10) : null,
        deliveryDate: dto.deliveryDate ? dto.deliveryDate.slice(0, 10) : null,
        actualDeliveryDate: null,
        createdByUserId: userId,
        approvedByUserId: null,
        approvedDate: null,
        quickbooksPoId: dto.quickbooksPoId ?? null,
        notes: dto.notes ?? null,
      });
      const savedPo = await em.save(PurchaseOrder, po);
      // Defensive: some DBs generate purchase_order_id server-side; ensure we use the persisted id.
      const persistedPo =
        savedPo.id
          ? savedPo
          : await em.findOneOrFail(PurchaseOrder, {
              where: { poNumber },
              select: ['id'],
            });

      for (const l of resolvedLines) {
        const pol = em.create(PurchaseOrderLine, {
          purchaseOrderId: persistedPo.id,
          productId: l.productId,
          orderedQuantity: String(l.orderedQty),
          receivedQuantity: '0',
          unitCost: String(l.unitCost),
          lineTotal: String(l.lineTotal),
          notes: l.notes ?? null,
        });
        await em.save(PurchaseOrderLine, pol);
      }

      return persistedPo.id;
    });

    return this.poRepo.findOne({
      where: { id: savedId },
      relations: ['supplier', 'warehouse', 'lines', 'lines.product'],
    });
  }

  private normalizePoId(id: string): string {
    return (id ?? '').split('/').filter(Boolean).at(-1) ?? id;
  }

  async approve(id: string, userId: string, _comment?: string) {
    const poId = this.normalizePoId(id);
    const po = await this.poRepo.findOne({ where: { id: poId } });
    if (!po) throw new NotFoundException('Purchase order not found');
    if (po.status !== 'Draft' && po.status !== 'Pending_approval') {
      throw new BadRequestException(`Cannot approve PO in status ${po.status}`);
    }
    po.status = 'Approved';
    po.approvedDate = new Date();
    po.approvedByUserId = userId;
    await this.poRepo.save(po);
    return this.poRepo.findOne({
      where: { id: poId },
      relations: ['supplier', 'warehouse', 'lines', 'lines.product'],
    });
  }

  async receive(id: string, dto: ReceivePurchaseOrderDto, userId?: string) {
    void userId;
    const poId = this.normalizePoId(id);
    const po = await this.poRepo.findOne({ where: { id: poId }, relations: ['lines'] });
    if (!po) throw new NotFoundException('Purchase order not found');
    if (po.status !== 'Approved') throw new BadRequestException('PO must be approved before receiving');
    for (const rec of dto.lines) {
      const line = await this.lineRepo.findOne({ where: { id: rec.poLineId } });
      if (!line || line.purchaseOrderId !== poId) throw new NotFoundException(`PO line ${rec.poLineId} not found`);
      const nextReceived = roundMoney(Number(line.receivedQuantity) + rec.receivedQty);
      line.receivedQuantity = String(nextReceived);
      await this.lineRepo.save(line);
    }
    const allLines = await this.lineRepo.find({ where: { purchaseOrderId: poId } });
    const allReceived = allLines.every(
      (l) => Number(l.receivedQuantity) >= Number(l.orderedQuantity),
    );
    if (allReceived) {
      po.status = 'Received';
      await this.poRepo.save(po);
    }
    return this.poRepo.findOne({
      where: { id: poId },
      relations: ['supplier', 'warehouse', 'lines', 'lines.product'],
    });
  }

  async getReplenishmentRecommendations(warehouseId?: string, sku?: string) {
    return {
      warehouseId: warehouseId ?? null,
      sku: sku ?? null,
      recommendations: [],
      message: 'Replenishment recommendations (stub). Implement using inventory levels and forecast.',
    };
  }
}
