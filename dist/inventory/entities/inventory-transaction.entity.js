"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "InventoryTransaction", {
    enumerable: true,
    get: function() {
        return InventoryTransaction;
    }
});
const _typeorm = require("typeorm");
const _productentity = require("./product.entity");
const _warehouseentity = require("./warehouse.entity");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let InventoryTransaction = class InventoryTransaction {
};
_ts_decorate([
    (0, _typeorm.PrimaryGeneratedColumn)('uuid'),
    _ts_metadata("design:type", String)
], InventoryTransaction.prototype, "id", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        name: 'product_id',
        type: 'uuid'
    }),
    _ts_metadata("design:type", String)
], InventoryTransaction.prototype, "productId", void 0);
_ts_decorate([
    (0, _typeorm.ManyToOne)(()=>_productentity.Product, {
        onDelete: 'CASCADE'
    }),
    (0, _typeorm.JoinColumn)({
        name: 'product_id'
    }),
    _ts_metadata("design:type", typeof _productentity.Product === "undefined" ? Object : _productentity.Product)
], InventoryTransaction.prototype, "product", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        name: 'warehouse_id',
        type: 'uuid'
    }),
    _ts_metadata("design:type", String)
], InventoryTransaction.prototype, "warehouseId", void 0);
_ts_decorate([
    (0, _typeorm.ManyToOne)(()=>_warehouseentity.Warehouse, {
        onDelete: 'CASCADE'
    }),
    (0, _typeorm.JoinColumn)({
        name: 'warehouse_id'
    }),
    _ts_metadata("design:type", typeof _warehouseentity.Warehouse === "undefined" ? Object : _warehouseentity.Warehouse)
], InventoryTransaction.prototype, "warehouse", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        name: 'source_type',
        type: 'varchar'
    }),
    _ts_metadata("design:type", String)
], InventoryTransaction.prototype, "sourceType", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        name: 'source_id',
        type: 'varchar',
        nullable: true
    }),
    _ts_metadata("design:type", Object)
], InventoryTransaction.prototype, "sourceId", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        name: 'quantity_delta',
        type: 'decimal',
        precision: 14,
        scale: 4
    }),
    _ts_metadata("design:type", Number)
], InventoryTransaction.prototype, "quantityDelta", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        name: 'lot_number',
        type: 'varchar',
        nullable: true
    }),
    _ts_metadata("design:type", Object)
], InventoryTransaction.prototype, "lotNumber", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        name: 'expiry_date',
        type: 'date',
        nullable: true
    }),
    _ts_metadata("design:type", Object)
], InventoryTransaction.prototype, "expiryDate", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        name: 'created_by_user_id',
        type: 'uuid',
        nullable: true
    }),
    _ts_metadata("design:type", Object)
], InventoryTransaction.prototype, "createdByUserId", void 0);
_ts_decorate([
    (0, _typeorm.CreateDateColumn)({
        name: 'created_at'
    }),
    _ts_metadata("design:type", typeof Date === "undefined" ? Object : Date)
], InventoryTransaction.prototype, "createdAt", void 0);
InventoryTransaction = _ts_decorate([
    (0, _typeorm.Entity)('inventory_transactions')
], InventoryTransaction);

//# sourceMappingURL=inventory-transaction.entity.js.map