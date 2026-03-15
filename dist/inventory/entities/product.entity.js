"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "Product", {
    enumerable: true,
    get: function() {
        return Product;
    }
});
const _typeorm = require("typeorm");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let Product = class Product {
};
_ts_decorate([
    (0, _typeorm.PrimaryGeneratedColumn)('uuid'),
    _ts_metadata("design:type", String)
], Product.prototype, "id", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        type: 'varchar',
        unique: true
    }),
    _ts_metadata("design:type", String)
], Product.prototype, "sku", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        type: 'varchar'
    }),
    _ts_metadata("design:type", String)
], Product.prototype, "name", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        type: 'text',
        nullable: true
    }),
    _ts_metadata("design:type", String)
], Product.prototype, "description", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        type: 'varchar',
        nullable: true,
        default: 'EA'
    }),
    _ts_metadata("design:type", String)
], Product.prototype, "uom", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        type: 'varchar',
        default: 'active'
    }),
    _ts_metadata("design:type", String)
], Product.prototype, "status", void 0);
_ts_decorate([
    (0, _typeorm.CreateDateColumn)({
        name: 'created_at'
    }),
    _ts_metadata("design:type", typeof Date === "undefined" ? Object : Date)
], Product.prototype, "createdAt", void 0);
_ts_decorate([
    (0, _typeorm.UpdateDateColumn)({
        name: 'updated_at'
    }),
    _ts_metadata("design:type", typeof Date === "undefined" ? Object : Date)
], Product.prototype, "updatedAt", void 0);
Product = _ts_decorate([
    (0, _typeorm.Entity)('products')
], Product);

//# sourceMappingURL=product.entity.js.map