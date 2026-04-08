"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "Warehouse", {
    enumerable: true,
    get: function() {
        return Warehouse;
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
let Warehouse = class Warehouse {
};
_ts_decorate([
    (0, _typeorm.PrimaryColumn)({
        name: 'warehouse_id',
        type: 'int'
    }),
    _ts_metadata("design:type", Number)
], Warehouse.prototype, "warehouseId", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        name: 'name',
        type: 'varchar',
        length: 255
    }),
    _ts_metadata("design:type", String)
], Warehouse.prototype, "name", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        name: 'address',
        type: 'text',
        nullable: true
    }),
    _ts_metadata("design:type", Object)
], Warehouse.prototype, "address", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        name: 'location',
        type: 'varchar',
        length: 255,
        nullable: true
    }),
    _ts_metadata("design:type", Object)
], Warehouse.prototype, "location", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        name: 'is_active',
        type: 'boolean',
        default: true
    }),
    _ts_metadata("design:type", Boolean)
], Warehouse.prototype, "isActive", void 0);
_ts_decorate([
    (0, _typeorm.CreateDateColumn)({
        name: 'created_at'
    }),
    _ts_metadata("design:type", typeof Date === "undefined" ? Object : Date)
], Warehouse.prototype, "createdAt", void 0);
Warehouse = _ts_decorate([
    (0, _typeorm.Entity)({
        name: 'warehouse',
        schema: 'snadb',
        synchronize: false
    })
], Warehouse);

//# sourceMappingURL=warehouse.entity.js.map