import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Inventory } from './entities/inventory.entity';
import { InventoryTransaction } from './entities/inventory-transaction.entity';
import { Product } from './entities/product.entity';
import { Warehouse } from './entities/warehouse.entity';
import { Transfer } from './entities/transfer.entity';
import { TransferLine } from './entities/transfer-line.entity';
import { FilterInventoryDto } from './dto/filter-inventory.dto';
import { AdjustInventoryDto } from './dto/adjust-inventory.dto';
import { CreateTransferDto } from './dto/create-transfer.dto';
import { CreateWarehouseDto } from './dto/create-warehouse.dto';
import { CreateProductDto } from './dto/create-product.dto';

@Injectable()
export class InventoryService {
  constructor(
    @InjectRepository(Inventory)
    private readonly inventoryRepo: Repository<Inventory>,
    @InjectRepository(InventoryTransaction)
    private readonly transactionRepo: Repository<InventoryTransaction>,
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
    @InjectRepository(Warehouse)
    private readonly warehouseRepo: Repository<Warehouse>,
    @InjectRepository(Transfer)
    private readonly transferRepo: Repository<Transfer>,
    @InjectRepository(TransferLine)
    private readonly transferLineRepo: Repository<TransferLine>,
  ) {}

  async list(dto: FilterInventoryDto, userId?: string) {
    const page = dto.page ?? 1;
    const pageSize = dto.pageSize ?? 20;
    const qb = this.inventoryRepo
      .createQueryBuilder('inv')
      .leftJoinAndSelect('inv.product', 'p')
      .leftJoinAndSelect('inv.warehouse', 'w')
      .where('inv.quantity_on_hand != 0');

    if (dto.sku) qb.andWhere('p.sku = :sku', { sku: dto.sku });
    if (dto.warehouseId) qb.andWhere('inv.warehouse_id = :warehouseId', { warehouseId: dto.warehouseId });
    if (dto.status) qb.andWhere('inv.status = :status', { status: dto.status });
    if (dto.lotNumber) qb.andWhere('inv.lot_number = :lotNumber', { lotNumber: dto.lotNumber });

    const [items, total] = await qb
      .orderBy('p.sku')
      .addOrderBy('inv.warehouse_id')
      .skip((page - 1) * pageSize)
      .take(pageSize)
      .getManyAndCount();

    return {
      data: items.map((inv) => ({
        id: inv.id,
        sku: inv.product?.sku,
        productId: inv.productId,
        productName: inv.product?.name,
        warehouseId: inv.warehouseId,
        warehouseCode: inv.warehouse?.code,
        lotNumber: inv.lotNumber,
        expiryDate: inv.expiryDate,
        quantityOnHand: Number(inv.quantityOnHand),
        status: inv.status,
      })),
      total,
      page,
      pageSize,
    };
  }

  async getBySku(sku: string) {
    const product = await this.productRepo.findOne({ where: { sku } });
    if (!product) throw new NotFoundException(`Product with SKU ${sku} not found`);

    const rows = await this.inventoryRepo.find({
      where: { productId: product.id },
      relations: ['warehouse'],
    });

    return {
      sku: product.sku,
      productId: product.id,
      productName: product.name,
      byLocation: rows.map((r) => ({
        warehouseId: r.warehouseId,
        warehouseCode: r.warehouse?.code,
        lotNumber: r.lotNumber,
        expiryDate: r.expiryDate,
        quantityOnHand: Number(r.quantityOnHand),
        status: r.status,
      })),
      totalOnHand: rows.reduce((sum, r) => sum + Number(r.quantityOnHand), 0),
    };
  }

  async getExpiring(days: number = 120, warehouseId?: string) {
    const qb = this.inventoryRepo
      .createQueryBuilder('inv')
      .leftJoinAndSelect('inv.product', 'p')
      .leftJoinAndSelect('inv.warehouse', 'w')
      .where('inv.expiry_date IS NOT NULL')
      .andWhere('inv.expiry_date <= :cutoff', {
        cutoff: new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
      })
      .andWhere('inv.quantity_on_hand > 0');

    if (warehouseId) qb.andWhere('inv.warehouse_id = :warehouseId', { warehouseId });

    const items = await qb.orderBy('inv.expiry_date').getMany();
    return items.map((inv) => ({
      sku: inv.product?.sku,
      warehouseCode: inv.warehouse?.code,
      lotNumber: inv.lotNumber,
      expiryDate: inv.expiryDate,
      quantityOnHand: Number(inv.quantityOnHand),
    }));
  }

  async adjust(dto: AdjustInventoryDto, userId?: string) {
    const product = await this.productRepo.findOne({ where: { id: dto.productId } });
    if (!product) throw new NotFoundException('Product not found');
    const warehouse = await this.warehouseRepo.findOne({ where: { id: dto.warehouseId } });
    if (!warehouse) throw new NotFoundException('Warehouse not found');

    let inv = await this.inventoryRepo.findOne({
      where: {
        productId: dto.productId,
        warehouseId: dto.warehouseId,
        lotNumber: dto.lotNumber ?? null,
        expiryDate: dto.expiryDate ?? null,
        status: 'available',
      },
    });

    if (!inv) {
      inv = this.inventoryRepo.create({
        productId: dto.productId,
        warehouseId: dto.warehouseId,
        lotNumber: dto.lotNumber ?? null,
        expiryDate: dto.expiryDate ?? null,
        quantityOnHand: 0,
        status: 'available',
      });
      await this.inventoryRepo.save(inv);
    }

    const delta = Number(dto.quantityDelta);
    const newQty = Number(inv.quantityOnHand) + delta;
    if (newQty < 0) throw new BadRequestException('Resulting quantity would be negative');

    inv.quantityOnHand = newQty;
    await this.inventoryRepo.save(inv);

    await this.transactionRepo.save(
      this.transactionRepo.create({
        productId: dto.productId,
        warehouseId: dto.warehouseId,
        sourceType: 'adjustment',
        sourceId: inv.id,
        quantityDelta: delta,
        lotNumber: inv.lotNumber,
        expiryDate: inv.expiryDate,
        createdByUserId: userId ?? null,
      }),
    );

    return {
      id: inv.id,
      sku: product.sku,
      warehouseCode: warehouse.code,
      previousQuantity: Number(inv.quantityOnHand) - delta,
      newQuantity: Number(inv.quantityOnHand),
      reason: dto.reason,
    };
  }

  async createTransfer(dto: CreateTransferDto, userId?: string) {
    if (dto.fromWarehouseId === dto.toWarehouseId) {
      throw new BadRequestException('From and to warehouse must be different');
    }
    const fromWh = await this.warehouseRepo.findOne({ where: { id: dto.fromWarehouseId } });
    const toWh = await this.warehouseRepo.findOne({ where: { id: dto.toWarehouseId } });
    if (!fromWh || !toWh) throw new NotFoundException('Warehouse not found');

    const transferNumber = `TR-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const requestedDate = dto.requestedDate ?? new Date().toISOString().slice(0, 10);

    const transfer = this.transferRepo.create({
      transferNumber,
      fromWarehouseId: dto.fromWarehouseId,
      toWarehouseId: dto.toWarehouseId,
      status: 'draft',
      requestedDate,
      createdByUserId: userId ?? null,
    });
    await this.transferRepo.save(transfer);

    for (const line of dto.lines) {
      const product = await this.productRepo.findOne({ where: { id: line.productId } });
      if (!product) throw new NotFoundException(`Product ${line.productId} not found`);
      await this.transferLineRepo.save(
        this.transferLineRepo.create({
          transferId: transfer.id,
          productId: line.productId,
          requestedQty: line.requestedQty,
        }),
      );
    }

    const saved = await this.transferRepo.findOne({
      where: { id: transfer.id },
      relations: ['lines', 'lines.product', 'fromWarehouse', 'toWarehouse'],
    });

    return {
      id: saved!.id,
      transferNumber: saved!.transferNumber,
      fromWarehouse: saved!.fromWarehouse?.code,
      toWarehouse: saved!.toWarehouse?.code,
      status: saved!.status,
      requestedDate: saved!.requestedDate,
      lines: saved!.lines?.map((l) => ({
        productId: l.productId,
        sku: l.product?.sku,
        requestedQty: Number(l.requestedQty),
      })),
    };
  }

  async listWarehouses() {
    const list = await this.warehouseRepo.find({
      order: { code: 'ASC' },
    });
    return list.map((w) => ({
      id: w.id,
      code: w.code,
      name: w.name,
      country: w.country,
      state: w.state,
      city: w.city,
      isActive: w.isActive,
    }));
  }

  async createWarehouse(dto: CreateWarehouseDto) {
    const existing = await this.warehouseRepo.findOne({ where: { code: dto.code } });
    if (existing) throw new ConflictException(`Warehouse code "${dto.code}" already exists`);
    const w = this.warehouseRepo.create({
      code: dto.code,
      name: dto.name,
      country: dto.country,
      state: dto.state,
      city: dto.city,
      isActive: dto.isActive ?? true,
    });
    const saved = await this.warehouseRepo.save(w);
    return {
      id: saved.id,
      code: saved.code,
      name: saved.name,
      country: saved.country,
      state: saved.state,
      city: saved.city,
      isActive: saved.isActive,
    };
  }

  async listProducts() {
    const list = await this.productRepo.find({
      order: { sku: 'ASC' },
    });
    return list.map((p) => ({
      id: p.id,
      sku: p.sku,
      name: p.name,
      description: p.description,
      uom: p.uom,
      status: p.status,
    }));
  }

  async createProduct(dto: CreateProductDto) {
    const existing = await this.productRepo.findOne({ where: { sku: dto.sku } });
    if (existing) throw new ConflictException(`Product SKU "${dto.sku}" already exists`);
    const p = this.productRepo.create({
      sku: dto.sku,
      name: dto.name,
      description: dto.description,
      uom: dto.uom ?? 'EA',
      status: dto.status ?? 'active',
    });
    const saved = await this.productRepo.save(p);
    return {
      id: saved.id,
      sku: saved.sku,
      name: saved.name,
      description: saved.description,
      uom: saved.uom,
      status: saved.status,
    };
  }
}
