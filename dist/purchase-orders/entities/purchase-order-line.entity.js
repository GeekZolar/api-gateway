"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "PurchaseOrderLine", {
    enumerable: true,
    get: function() {
        return PurchaseOrderLine;
    }
});
const _typeorm = require("typeorm");
const _productentity = require("../../inventory/entities/product.entity");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let PurchaseOrderLine = class PurchaseOrderLine {
};
_ts_decorate([
    (0, _typeorm.PrimaryGeneratedColumn)('uuid'),
    _ts_metadata("design:type", String)
], PurchaseOrderLine.prototype, "id", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        name: 'purchase_order_id',
        type: 'uuid'
    }),
    _ts_metadata("design:type", String)
], PurchaseOrderLine.prototype, "purchaseOrderId", void 0);
_ts_decorate([
    (0, _typeorm.ManyToOne)('PurchaseOrder', 'lines', {
        onDelete: 'CASCADE'
    }),
    (0, _typeorm.JoinColumn)({
        name: 'purchase_order_id'
    }),
    _ts_metadata("design:type", typeof Relation === "undefined" ? Object : Relation)
], PurchaseOrderLine.prototype, "purchaseOrder", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        name: 'product_id',
        type: 'uuid'
    }),
    _ts_metadata("design:type", String)
], PurchaseOrderLine.prototype, "productId", void 0);
_ts_decorate([
    (0, _typeorm.ManyToOne)(()=>_productentity.Product, {
        onDelete: 'RESTRICT'
    }),
    (0, _typeorm.JoinColumn)({
        name: 'product_id'
    }),
    _ts_metadata("design:type", typeof _productentity.Product === "undefined" ? Object : _productentity.Product)
], PurchaseOrderLine.prototype, "product", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        name: 'ordered_qty',
        type: 'decimal',
        precision: 14,
        scale: 4
    }),
    _ts_metadata("design:type", Number)
], PurchaseOrderLine.prototype, "orderedQty", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        name: 'received_qty',
        type: 'decimal',
        precision: 14,
        scale: 4,
        default: 0
    }),
    _ts_metadata("design:type", Number)
], PurchaseOrderLine.prototype, "receivedQty", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        name: 'unit_cost',
        type: 'decimal',
        precision: 14,
        scale: 4,
        default: 0
    }),
    _ts_metadata("design:type", Number)
], PurchaseOrderLine.prototype, "unitCost", void 0);
PurchaseOrderLine = _ts_decorate([
    (0, _typeorm.Entity)('purchase_order_lines')
], PurchaseOrderLine);

//# sourceMappingURL=purchase-order-line.entity.js.map