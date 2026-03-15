"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "Transfer", {
    enumerable: true,
    get: function() {
        return Transfer;
    }
});
const _typeorm = require("typeorm");
const _warehouseentity = require("./warehouse.entity");
const _transferlineentity = require("./transfer-line.entity");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let Transfer = class Transfer {
};
_ts_decorate([
    (0, _typeorm.PrimaryGeneratedColumn)('uuid'),
    _ts_metadata("design:type", String)
], Transfer.prototype, "id", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        name: 'transfer_number',
        type: 'varchar',
        unique: true
    }),
    _ts_metadata("design:type", String)
], Transfer.prototype, "transferNumber", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        name: 'from_warehouse_id',
        type: 'uuid'
    }),
    _ts_metadata("design:type", String)
], Transfer.prototype, "fromWarehouseId", void 0);
_ts_decorate([
    (0, _typeorm.ManyToOne)(()=>_warehouseentity.Warehouse, {
        onDelete: 'RESTRICT'
    }),
    (0, _typeorm.JoinColumn)({
        name: 'from_warehouse_id'
    }),
    _ts_metadata("design:type", typeof _warehouseentity.Warehouse === "undefined" ? Object : _warehouseentity.Warehouse)
], Transfer.prototype, "fromWarehouse", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        name: 'to_warehouse_id',
        type: 'uuid'
    }),
    _ts_metadata("design:type", String)
], Transfer.prototype, "toWarehouseId", void 0);
_ts_decorate([
    (0, _typeorm.ManyToOne)(()=>_warehouseentity.Warehouse, {
        onDelete: 'RESTRICT'
    }),
    (0, _typeorm.JoinColumn)({
        name: 'to_warehouse_id'
    }),
    _ts_metadata("design:type", typeof _warehouseentity.Warehouse === "undefined" ? Object : _warehouseentity.Warehouse)
], Transfer.prototype, "toWarehouse", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        type: 'varchar',
        default: 'draft'
    }),
    _ts_metadata("design:type", String)
], Transfer.prototype, "status", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        name: 'requested_date',
        type: 'date'
    }),
    _ts_metadata("design:type", String)
], Transfer.prototype, "requestedDate", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        name: 'completed_date',
        type: 'date',
        nullable: true
    }),
    _ts_metadata("design:type", Object)
], Transfer.prototype, "completedDate", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        name: 'created_by_user_id',
        type: 'uuid',
        nullable: true
    }),
    _ts_metadata("design:type", Object)
], Transfer.prototype, "createdByUserId", void 0);
_ts_decorate([
    (0, _typeorm.OneToMany)(()=>_transferlineentity.TransferLine, (line)=>line.transfer),
    _ts_metadata("design:type", Array)
], Transfer.prototype, "lines", void 0);
_ts_decorate([
    (0, _typeorm.CreateDateColumn)({
        name: 'created_at'
    }),
    _ts_metadata("design:type", typeof Date === "undefined" ? Object : Date)
], Transfer.prototype, "createdAt", void 0);
_ts_decorate([
    (0, _typeorm.UpdateDateColumn)({
        name: 'updated_at'
    }),
    _ts_metadata("design:type", typeof Date === "undefined" ? Object : Date)
], Transfer.prototype, "updatedAt", void 0);
Transfer = _ts_decorate([
    (0, _typeorm.Entity)('transfers')
], Transfer);

//# sourceMappingURL=transfer.entity.js.map