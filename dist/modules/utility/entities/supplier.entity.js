"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "Supplier", {
    enumerable: true,
    get: function() {
        return Supplier;
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
let Supplier = class Supplier {
};
_ts_decorate([
    (0, _typeorm.PrimaryColumn)({
        name: 'supplier_id',
        type: 'int'
    }),
    _ts_metadata("design:type", Number)
], Supplier.prototype, "supplierId", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        name: 'supplier_name',
        type: 'varchar',
        length: 255
    }),
    _ts_metadata("design:type", String)
], Supplier.prototype, "supplierName", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        name: 'address',
        type: 'text',
        nullable: true
    }),
    _ts_metadata("design:type", Object)
], Supplier.prototype, "address", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        name: 'location',
        type: 'varchar',
        length: 255,
        nullable: true
    }),
    _ts_metadata("design:type", Object)
], Supplier.prototype, "location", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        name: 'lead_time_days',
        type: 'int',
        nullable: true
    }),
    _ts_metadata("design:type", Object)
], Supplier.prototype, "leadTimeDays", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        name: 'is_active',
        type: 'boolean',
        default: true
    }),
    _ts_metadata("design:type", Boolean)
], Supplier.prototype, "isActive", void 0);
_ts_decorate([
    (0, _typeorm.CreateDateColumn)({
        name: 'created_at'
    }),
    _ts_metadata("design:type", typeof Date === "undefined" ? Object : Date)
], Supplier.prototype, "createdAt", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        name: 'note',
        type: 'text',
        nullable: true
    }),
    _ts_metadata("design:type", Object)
], Supplier.prototype, "note", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        name: 'contact_name',
        type: 'varchar',
        length: 255,
        nullable: true
    }),
    _ts_metadata("design:type", Object)
], Supplier.prototype, "contactName", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        name: 'contact_email',
        type: 'varchar',
        length: 50,
        nullable: true
    }),
    _ts_metadata("design:type", Object)
], Supplier.prototype, "contactEmail", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        name: 'contact_phone',
        type: 'varchar',
        length: 20,
        nullable: true
    }),
    _ts_metadata("design:type", Object)
], Supplier.prototype, "contactPhone", void 0);
Supplier = _ts_decorate([
    (0, _typeorm.Entity)({
        name: 'suppliers',
        schema: 'snadb',
        synchronize: false
    })
], Supplier);

//# sourceMappingURL=supplier.entity.js.map