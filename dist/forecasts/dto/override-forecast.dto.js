"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "OverrideForecastDto", {
    enumerable: true,
    get: function() {
        return OverrideForecastDto;
    }
});
const _classvalidator = require("class-validator");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let OverrideForecastDto = class OverrideForecastDto {
};
_ts_decorate([
    (0, _classvalidator.IsOptional)(),
    (0, _classvalidator.IsUUID)(),
    _ts_metadata("design:type", String)
], OverrideForecastDto.prototype, "warehouseId", void 0);
_ts_decorate([
    (0, _classvalidator.IsDateString)(),
    _ts_metadata("design:type", String)
], OverrideForecastDto.prototype, "periodStart", void 0);
_ts_decorate([
    (0, _classvalidator.IsDateString)(),
    _ts_metadata("design:type", String)
], OverrideForecastDto.prototype, "periodEnd", void 0);
_ts_decorate([
    (0, _classvalidator.IsNumber)(),
    _ts_metadata("design:type", Number)
], OverrideForecastDto.prototype, "overrideQty", void 0);

//# sourceMappingURL=override-forecast.dto.js.map