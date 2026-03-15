"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "Forecast", {
    enumerable: true,
    get: function() {
        return Forecast;
    }
});
const _typeorm = require("typeorm");
const _productentity = require("../../inventory/entities/product.entity");
const _warehouseentity = require("../../inventory/entities/warehouse.entity");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let Forecast = class Forecast {
};
_ts_decorate([
    (0, _typeorm.PrimaryGeneratedColumn)('uuid'),
    _ts_metadata("design:type", String)
], Forecast.prototype, "id", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        name: 'product_id'
    }),
    _ts_metadata("design:type", String)
], Forecast.prototype, "productId", void 0);
_ts_decorate([
    (0, _typeorm.ManyToOne)(()=>_productentity.Product, {
        onDelete: 'CASCADE'
    }),
    (0, _typeorm.JoinColumn)({
        name: 'product_id'
    }),
    _ts_metadata("design:type", typeof _productentity.Product === "undefined" ? Object : _productentity.Product)
], Forecast.prototype, "product", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        name: 'warehouse_id'
    }),
    _ts_metadata("design:type", String)
], Forecast.prototype, "warehouseId", void 0);
_ts_decorate([
    (0, _typeorm.ManyToOne)(()=>_warehouseentity.Warehouse, {
        onDelete: 'CASCADE'
    }),
    (0, _typeorm.JoinColumn)({
        name: 'warehouse_id'
    }),
    _ts_metadata("design:type", typeof _warehouseentity.Warehouse === "undefined" ? Object : _warehouseentity.Warehouse)
], Forecast.prototype, "warehouse", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        name: 'period_start',
        type: 'date'
    }),
    _ts_metadata("design:type", String)
], Forecast.prototype, "periodStart", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        name: 'period_end',
        type: 'date'
    }),
    _ts_metadata("design:type", String)
], Forecast.prototype, "periodEnd", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        name: 'forecast_qty',
        type: 'decimal',
        precision: 14,
        scale: 4,
        default: 0
    }),
    _ts_metadata("design:type", Number)
], Forecast.prototype, "forecastQty", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        name: 'override_qty',
        type: 'decimal',
        precision: 14,
        scale: 4,
        nullable: true
    }),
    _ts_metadata("design:type", Object)
], Forecast.prototype, "overrideQty", void 0);
_ts_decorate([
    (0, _typeorm.CreateDateColumn)({
        name: 'created_at'
    }),
    _ts_metadata("design:type", typeof Date === "undefined" ? Object : Date)
], Forecast.prototype, "createdAt", void 0);
_ts_decorate([
    (0, _typeorm.UpdateDateColumn)({
        name: 'updated_at'
    }),
    _ts_metadata("design:type", typeof Date === "undefined" ? Object : Date)
], Forecast.prototype, "updatedAt", void 0);
Forecast = _ts_decorate([
    (0, _typeorm.Entity)('forecasts')
], Forecast);

//# sourceMappingURL=forecast.entity.js.map