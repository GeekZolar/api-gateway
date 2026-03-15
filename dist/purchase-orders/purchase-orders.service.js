"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "PurchaseOrdersService", {
    enumerable: true,
    get: function() {
        return PurchaseOrdersService;
    }
});
const _common = require("@nestjs/common");
const _typeorm = require("@nestjs/typeorm");
const _typeorm1 = require("typeorm");
const _purchaseorderentity = require("./entities/purchase-order.entity");
const _purchaseorderlineentity = require("./entities/purchase-order-line.entity");
const _supplierentity = require("./entities/supplier.entity");
const _productentity = require("../inventory/entities/product.entity");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
function _ts_param(paramIndex, decorator) {
    return function(target, key) {
        decorator(target, key, paramIndex);
    };
}
let PurchaseOrdersService = class PurchaseOrdersService {
    async list(dto) {
        const page = dto.page ?? 1;
        const pageSize = dto.pageSize ?? 20;
        const qb = this.poRepo.createQueryBuilder('po').leftJoinAndSelect('po.supplier', 'supplier').leftJoinAndSelect('po.warehouse', 'warehouse').leftJoinAndSelect('po.lines', 'lines').leftJoinAndSelect('lines.product', 'product');
        if (dto.supplierId) qb.andWhere('po.supplier_id = :supplierId', {
            supplierId: dto.supplierId
        });
        if (dto.warehouseId) qb.andWhere('po.warehouse_id = :warehouseId', {
            warehouseId: dto.warehouseId
        });
        if (dto.status) qb.andWhere('po.status = :status', {
            status: dto.status
        });
        if (dto.fromDate) qb.andWhere('po.expected_date >= :fromDate', {
            fromDate: dto.fromDate
        });
        if (dto.toDate) qb.andWhere('po.expected_date <= :toDate', {
            toDate: dto.toDate
        });
        qb.orderBy('po.created_at', 'DESC');
        const [items, total] = await qb.skip((page - 1) * pageSize).take(pageSize).getManyAndCount();
        return {
            items,
            total,
            page,
            pageSize
        };
    }
    async create(dto, userId) {
        const supplier = await this.supplierRepo.findOne({
            where: {
                id: dto.supplierId
            }
        });
        if (!supplier) throw new _common.NotFoundException('Supplier not found');
        const poNumber = `PO-${Date.now()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
        const po = this.poRepo.create({
            poNumber,
            supplierId: dto.supplierId,
            warehouseId: dto.warehouseId,
            expectedDate: dto.expectedDate,
            status: 'draft'
        });
        const savedPo = await this.poRepo.save(po);
        for (const line of dto.lines){
            let productId = line.productId;
            if (!productId && line.sku) {
                const product = await this.productRepo.findOne({
                    where: {
                        sku: line.sku
                    }
                });
                if (!product) throw new _common.BadRequestException(`Product SKU ${line.sku} not found`);
                productId = product.id;
            }
            if (!productId) throw new _common.BadRequestException('Each line must have productId or sku');
            const pol = this.lineRepo.create({
                purchaseOrderId: savedPo.id,
                productId,
                orderedQty: line.orderedQty,
                unitCost: line.unitCost ?? 0
            });
            await this.lineRepo.save(pol);
        }
        return this.poRepo.findOne({
            where: {
                id: savedPo.id
            },
            relations: [
                'supplier',
                'warehouse',
                'lines',
                'lines.product'
            ]
        });
    }
    async approve(id, userId, _comment) {
        const po = await this.poRepo.findOne({
            where: {
                id
            }
        });
        if (!po) throw new _common.NotFoundException('Purchase order not found');
        if (po.status !== 'draft' && po.status !== 'pending_approval') {
            throw new _common.BadRequestException(`Cannot approve PO in status ${po.status}`);
        }
        po.status = 'approved';
        po.approvedAt = new Date();
        po.approvedByUserId = userId;
        await this.poRepo.save(po);
        return this.poRepo.findOne({
            where: {
                id
            },
            relations: [
                'supplier',
                'warehouse',
                'lines',
                'lines.product'
            ]
        });
    }
    async receive(id, dto, userId) {
        const po = await this.poRepo.findOne({
            where: {
                id
            },
            relations: [
                'lines'
            ]
        });
        if (!po) throw new _common.NotFoundException('Purchase order not found');
        if (po.status !== 'approved') throw new _common.BadRequestException('PO must be approved before receiving');
        for (const rec of dto.lines){
            const line = await this.lineRepo.findOne({
                where: {
                    id: rec.poLineId
                }
            });
            if (!line || line.purchaseOrderId !== id) throw new _common.NotFoundException(`PO line ${rec.poLineId} not found`);
            line.receivedQty = Number(line.receivedQty) + rec.receivedQty;
            await this.lineRepo.save(line);
        }
        const allLines = await this.lineRepo.find({
            where: {
                purchaseOrderId: id
            }
        });
        const allReceived = allLines.every((l)=>Number(l.receivedQty) >= Number(l.orderedQty));
        if (allReceived) {
            po.status = 'received';
            await this.poRepo.save(po);
        }
        return this.poRepo.findOne({
            where: {
                id
            },
            relations: [
                'supplier',
                'warehouse',
                'lines',
                'lines.product'
            ]
        });
    }
    async getReplenishmentRecommendations(warehouseId, sku) {
        // Stub: return empty or placeholder; real impl would use min/max, forecast, lead time
        return {
            warehouseId: warehouseId ?? null,
            sku: sku ?? null,
            recommendations: [],
            message: 'Replenishment recommendations (stub). Implement using inventory levels and forecast.'
        };
    }
    constructor(poRepo, lineRepo, supplierRepo, productRepo){
        this.poRepo = poRepo;
        this.lineRepo = lineRepo;
        this.supplierRepo = supplierRepo;
        this.productRepo = productRepo;
    }
};
PurchaseOrdersService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_param(0, (0, _typeorm.InjectRepository)(_purchaseorderentity.PurchaseOrder)),
    _ts_param(1, (0, _typeorm.InjectRepository)(_purchaseorderlineentity.PurchaseOrderLine)),
    _ts_param(2, (0, _typeorm.InjectRepository)(_supplierentity.Supplier)),
    _ts_param(3, (0, _typeorm.InjectRepository)(_productentity.Product)),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _typeorm1.Repository === "undefined" ? Object : _typeorm1.Repository,
        typeof _typeorm1.Repository === "undefined" ? Object : _typeorm1.Repository,
        typeof _typeorm1.Repository === "undefined" ? Object : _typeorm1.Repository,
        typeof _typeorm1.Repository === "undefined" ? Object : _typeorm1.Repository
    ])
], PurchaseOrdersService);

//# sourceMappingURL=purchase-orders.service.js.map