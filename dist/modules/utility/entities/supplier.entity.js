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
exports.Supplier = void 0;
const typeorm_1 = require("typeorm");
let Supplier = class Supplier {
};
exports.Supplier = Supplier;
__decorate([
    (0, typeorm_1.PrimaryColumn)({ name: 'supplier_id', type: 'int' }),
    __metadata("design:type", Number)
], Supplier.prototype, "supplierId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'supplier_name', type: 'varchar', length: 255 }),
    __metadata("design:type", String)
], Supplier.prototype, "supplierName", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'address', type: 'text', nullable: true }),
    __metadata("design:type", Object)
], Supplier.prototype, "address", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'location', type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", Object)
], Supplier.prototype, "location", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'lead_time_days', type: 'int', nullable: true }),
    __metadata("design:type", Object)
], Supplier.prototype, "leadTimeDays", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'is_active', type: 'boolean', default: true }),
    __metadata("design:type", Boolean)
], Supplier.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], Supplier.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'note', type: 'text', nullable: true }),
    __metadata("design:type", Object)
], Supplier.prototype, "note", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'contact_name', type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", Object)
], Supplier.prototype, "contactName", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'contact_email', type: 'varchar', length: 50, nullable: true }),
    __metadata("design:type", Object)
], Supplier.prototype, "contactEmail", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'contact_phone', type: 'varchar', length: 20, nullable: true }),
    __metadata("design:type", Object)
], Supplier.prototype, "contactPhone", void 0);
exports.Supplier = Supplier = __decorate([
    (0, typeorm_1.Entity)({ name: 'suppliers', schema: 'snadb', synchronize: false })
], Supplier);
//# sourceMappingURL=supplier.entity.js.map