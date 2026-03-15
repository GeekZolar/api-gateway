"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "PurchaseOrder", {
    enumerable: true,
    get: function() {
        return PurchaseOrder;
    }
});
const _typeorm = require("typeorm");
const _warehouseentity = require("../../inventory/entities/warehouse.entity");
const _supplierentity = require("./supplier.entity");
const _purchaseorderlineentity = require("./purchase-order-line.entity");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let PurchaseOrder = class PurchaseOrder {
};
_ts_decorate([
    (0, _typeorm.PrimaryGeneratedColumn)('uuid'),
    _ts_metadata("design:type", String)
], PurchaseOrder.prototype, "id", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        name: 'po_number',
        type: 'varchar',
        unique: true
    }),
    _ts_metadata("design:type", String)
], PurchaseOrder.prototype, "poNumber", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        name: 'supplier_id',
        type: 'uuid'
    }),
    _ts_metadata("design:type", String)
], PurchaseOrder.prototype, "supplierId", void 0);
_ts_decorate([
    (0, _typeorm.ManyToOne)(()=>_supplierentity.Supplier, {
        onDelete: 'RESTRICT'
    }),
    (0, _typeorm.JoinColumn)({
        name: 'supplier_id'
    }),
    _ts_metadata("design:type", typeof _supplierentity.Supplier === "undefined" ? Object : _supplierentity.Supplier)
], PurchaseOrder.prototype, "supplier", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        name: 'warehouse_id',
        type: 'uuid'
    }),
    _ts_metadata("design:type", String)
], PurchaseOrder.prototype, "warehouseId", void 0);
_ts_decorate([
    (0, _typeorm.ManyToOne)(()=>_warehouseentity.Warehouse, {
        onDelete: 'RESTRICT'
    }),
    (0, _typeorm.JoinColumn)({
        name: 'warehouse_id'
    }),
    _ts_metadata("design:type", typeof _warehouseentity.Warehouse === "undefined" ? Object : _warehouseentity.Warehouse)
], PurchaseOrder.prototype, "warehouse", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        name: 'expected_date',
        type: 'date'
    }),
    _ts_metadata("design:type", String)
], PurchaseOrder.prototype, "expectedDate", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        type: 'varchar',
        default: 'draft'
    }),
    _ts_metadata("design:type", String)
], PurchaseOrder.prototype, "status", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        name: 'approved_at',
        type: 'timestamptz',
        nullable: true
    }),
    _ts_metadata("design:type", Object)
], PurchaseOrder.prototype, "approvedAt", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        name: 'approved_by_user_id',
        type: 'uuid',
        nullable: true
    }),
    _ts_metadata("design:type", Object)
], PurchaseOrder.prototype, "approvedByUserId", void 0);
_ts_decorate([
    (0, _typeorm.OneToMany)(()=>_purchaseorderlineentity.PurchaseOrderLine, (line)=>line.purchaseOrder),
    _ts_metadata("design:type", Array)
], PurchaseOrder.prototype, "lines", void 0);
_ts_decorate([
    (0, _typeorm.CreateDateColumn)({
        name: 'created_at'
    }),
    _ts_metadata("design:type", typeof Date === "undefined" ? Object : Date)
], PurchaseOrder.prototype, "createdAt", void 0);
_ts_decorate([
    (0, _typeorm.UpdateDateColumn)({
        name: 'updated_at'
    }),
    _ts_metadata("design:type", typeof Date === "undefined" ? Object : Date)
], PurchaseOrder.prototype, "updatedAt", void 0);
PurchaseOrder = _ts_decorate([
    (0, _typeorm.Entity)('purchase_orders')
], PurchaseOrder);

//# sourceMappingURL=purchase-order.entity.js.map