"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "Inventory", {
    enumerable: true,
    get: function() {
        return Inventory;
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
let Inventory = class Inventory {
};
_ts_decorate([
    (0, _typeorm.PrimaryGeneratedColumn)('uuid'),
    _ts_metadata("design:type", String)
], Inventory.prototype, "id", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        name: 'product_id',
        type: 'uuid'
    }),
    _ts_metadata("design:type", String)
], Inventory.prototype, "productId", void 0);
_ts_decorate([
    (0, _typeorm.ManyToOne)(()=>_productentity.Product, {
        onDelete: 'CASCADE'
    }),
    (0, _typeorm.JoinColumn)({
        name: 'product_id'
    }),
    _ts_metadata("design:type", typeof _productentity.Product === "undefined" ? Object : _productentity.Product)
], Inventory.prototype, "product", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        name: 'warehouse_id',
        type: 'uuid'
    }),
    _ts_metadata("design:type", String)
], Inventory.prototype, "warehouseId", void 0);
_ts_decorate([
    (0, _typeorm.ManyToOne)(()=>_warehouseentity.Warehouse, {
        onDelete: 'CASCADE'
    }),
    (0, _typeorm.JoinColumn)({
        name: 'warehouse_id'
    }),
    _ts_metadata("design:type", typeof _warehouseentity.Warehouse === "undefined" ? Object : _warehouseentity.Warehouse)
], Inventory.prototype, "warehouse", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        name: 'lot_number',
        type: 'varchar',
        nullable: true
    }),
    _ts_metadata("design:type", Object)
], Inventory.prototype, "lotNumber", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        name: 'expiry_date',
        type: 'date',
        nullable: true
    }),
    _ts_metadata("design:type", Object)
], Inventory.prototype, "expiryDate", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        name: 'quantity_on_hand',
        type: 'decimal',
        precision: 14,
        scale: 4,
        default: 0
    }),
    _ts_metadata("design:type", Number)
], Inventory.prototype, "quantityOnHand", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        type: 'varchar',
        default: 'available'
    }),
    _ts_metadata("design:type", String)
], Inventory.prototype, "status", void 0);
_ts_decorate([
    (0, _typeorm.CreateDateColumn)({
        name: 'created_at'
    }),
    _ts_metadata("design:type", typeof Date === "undefined" ? Object : Date)
], Inventory.prototype, "createdAt", void 0);
_ts_decorate([
    (0, _typeorm.UpdateDateColumn)({
        name: 'updated_at'
    }),
    _ts_metadata("design:type", typeof Date === "undefined" ? Object : Date)
], Inventory.prototype, "updatedAt", void 0);
Inventory = _ts_decorate([
    (0, _typeorm.Entity)('inventory')
], Inventory);

//# sourceMappingURL=inventory.entity.js.map