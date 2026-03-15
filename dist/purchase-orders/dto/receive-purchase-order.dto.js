"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get ReceivePurchaseOrderDto () {
        return ReceivePurchaseOrderDto;
    },
    get ReceivePurchaseOrderLineDto () {
        return ReceivePurchaseOrderLineDto;
    }
});
const _classvalidator = require("class-validator");
const _classtransformer = require("class-transformer");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let ReceivePurchaseOrderLineDto = class ReceivePurchaseOrderLineDto {
};
_ts_decorate([
    (0, _classvalidator.IsUUID)(),
    _ts_metadata("design:type", String)
], ReceivePurchaseOrderLineDto.prototype, "poLineId", void 0);
_ts_decorate([
    (0, _classvalidator.IsNumber)(),
    _ts_metadata("design:type", Number)
], ReceivePurchaseOrderLineDto.prototype, "receivedQty", void 0);
_ts_decorate([
    (0, _classvalidator.IsOptional)(),
    (0, _classvalidator.IsString)(),
    _ts_metadata("design:type", String)
], ReceivePurchaseOrderLineDto.prototype, "lotNumber", void 0);
_ts_decorate([
    (0, _classvalidator.IsOptional)(),
    (0, _classvalidator.IsDateString)(),
    _ts_metadata("design:type", String)
], ReceivePurchaseOrderLineDto.prototype, "expiryDate", void 0);
let ReceivePurchaseOrderDto = class ReceivePurchaseOrderDto {
};
_ts_decorate([
    (0, _classvalidator.IsDateString)(),
    _ts_metadata("design:type", String)
], ReceivePurchaseOrderDto.prototype, "receiptDate", void 0);
_ts_decorate([
    (0, _classvalidator.IsArray)(),
    (0, _classvalidator.ValidateNested)({
        each: true
    }),
    (0, _classtransformer.Type)(()=>ReceivePurchaseOrderLineDto),
    _ts_metadata("design:type", Array)
], ReceivePurchaseOrderDto.prototype, "lines", void 0);

//# sourceMappingURL=receive-purchase-order.dto.js.map