"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Product = void 0;
const typeorm_1 = require("typeorm");
let Product = class Product {
};
exports.Product = Product;
__decorate([
    (0, typeorm_1.PrimaryColumn)({ name: 'product_id', type: 'int' }),
    __metadata("design:type", Number)
], Product.prototype, "productId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'supplier_id', type: 'int', nullable: true }),
    __metadata("design:type", Object)
], Product.prototype, "supplierId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'product_name', type: 'varchar', length: 500 }),
    __metadata("design:type", String)
], Product.prototype, "productName", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'description', type: 'text', nullable: true }),
    __metadata("design:type", Object)
], Product.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'category_id', type: 'int', nullable: true }),
    __metadata("design:type", Object)
], Product.prototype, "categoryId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'product_size', type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", Object)
], Product.prototype, "productSize", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'sku', type: 'varchar', length: 100, nullable: true }),
    __metadata("design:type", Object)
], Product.prototype, "sku", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'min_order_pallet', type: 'int', nullable: true }),
    __metadata("design:type", Object)
], Product.prototype, "minOrderPallet", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'case_per_pallet', type: 'int', nullable: true }),
    __metadata("design:type", Object)
], Product.prototype, "casePerPallet", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'shelf_life_month', type: 'int', nullable: true }),
    __metadata("design:type", Object)
], Product.prototype, "shelfLifeMonth", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'is_active', type: 'boolean', default: true }),
    __metadata("design:type", Boolean)
], Product.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'is_seasonal', type: 'boolean', default: false }),
    __metadata("design:type", Boolean)
], Product.prototype, "isSeasonal", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'season_start_date', type: 'date', nullable: true }),
    __metadata("design:type", Object)
], Product.prototype, "seasonStartDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'season_end_date', type: 'date', nullable: true }),
    __metadata("design:type", Object)
], Product.prototype, "seasonEndDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'country_code', type: 'varchar', length: 10, nullable: true }),
    __metadata("design:type", Object)
], Product.prototype, "countryCode", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], Product.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'modified_at', type: 'timestamptz', nullable: true }),
    __metadata("design:type", Object)
], Product.prototype, "modifiedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'note', type: 'text', nullable: true }),
    __metadata("design:type", Object)
], Product.prototype, "note", void 0);
exports.Product = Product = __decorate([
    (0, typeorm_1.Entity)({ name: 'products', schema: 'snadb', synchronize: false })
], Product);
//# sourceMappingURL=product.entity.js.map