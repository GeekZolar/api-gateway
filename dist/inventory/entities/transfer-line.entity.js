"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "TransferLine", {
    enumerable: true,
    get: function() {
        return TransferLine;
    }
});
const _typeorm = require("typeorm");
const _productentity = require("./product.entity");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let TransferLine = class TransferLine {
};
_ts_decorate([
    (0, _typeorm.PrimaryGeneratedColumn)('uuid'),
    _ts_metadata("design:type", String)
], TransferLine.prototype, "id", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        name: 'transfer_id',
        type: 'uuid'
    }),
    _ts_metadata("design:type", String)
], TransferLine.prototype, "transferId", void 0);
_ts_decorate([
    (0, _typeorm.ManyToOne)('Transfer', 'lines', {
        onDelete: 'CASCADE'
    }),
    (0, _typeorm.JoinColumn)({
        name: 'transfer_id'
    }),
    _ts_metadata("design:type", typeof Relation === "undefined" ? Object : Relation)
], TransferLine.prototype, "transfer", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        name: 'product_id',
        type: 'uuid'
    }),
    _ts_metadata("design:type", String)
], TransferLine.prototype, "productId", void 0);
_ts_decorate([
    (0, _typeorm.ManyToOne)(()=>_productentity.Product, {
        onDelete: 'CASCADE'
    }),
    (0, _typeorm.JoinColumn)({
        name: 'product_id'
    }),
    _ts_metadata("design:type", typeof _productentity.Product === "undefined" ? Object : _productentity.Product)
], TransferLine.prototype, "product", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        name: 'requested_qty',
        type: 'decimal',
        precision: 14,
        scale: 4
    }),
    _ts_metadata("design:type", Number)
], TransferLine.prototype, "requestedQty", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        name: 'shipped_qty',
        type: 'decimal',
        precision: 14,
        scale: 4,
        default: 0
    }),
    _ts_metadata("design:type", Number)
], TransferLine.prototype, "shippedQty", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        name: 'received_qty',
        type: 'decimal',
        precision: 14,
        scale: 4,
        default: 0
    }),
    _ts_metadata("design:type", Number)
], TransferLine.prototype, "receivedQty", void 0);
TransferLine = _ts_decorate([
    (0, _typeorm.Entity)('transfer_lines')
], TransferLine);

//# sourceMappingURL=transfer-line.entity.js.map