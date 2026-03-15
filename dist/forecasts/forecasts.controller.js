"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "ForecastsController", {
    enumerable: true,
    get: function() {
        return ForecastsController;
    }
});
const _common = require("@nestjs/common");
const _swagger = require("@nestjs/swagger");
const _jwtauthguard = require("../proxy/guards/jwt-auth.guard");
const _rolesguard = require("../auth/roles.guard");
const _rolesdecorator = require("../auth/roles.decorator");
const _forecastsservice = require("./forecasts.service");
const _forecastquerydto = require("./dto/forecast-query.dto");
const _generateforecastsdto = require("./dto/generate-forecasts.dto");
const _overrideforecastdto = require("./dto/override-forecast.dto");
const _accuracyquerydto = require("./dto/accuracy-query.dto");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
function _ts_param(paramIndex, decorator) {
    return function(target, key) {
        decorator(target, key, paramIndex);
    };
}
const FORECAST_READ = [
    'admin',
    'inventory-manager',
    'forecast-editor'
];
const FORECAST_EDIT = [
    'admin',
    'forecast-editor'
];
let ForecastsController = class ForecastsController {
    getAccuracy(dto) {
        return this.forecastsService.getAccuracy(dto.from, dto.to, dto.sku, dto.warehouseId);
    }
    generate(dto) {
        return this.forecastsService.generate(dto);
    }
    getBySku(sku, query) {
        return this.forecastsService.getBySku(sku, query.warehouseId, query.from, query.to);
    }
    override(sku, dto) {
        return this.forecastsService.override(sku, dto);
    }
    constructor(forecastsService){
        this.forecastsService = forecastsService;
    }
};
_ts_decorate([
    (0, _common.Get)('accuracy'),
    (0, _common.UseGuards)(_rolesguard.RolesGuard),
    (0, _rolesdecorator.Roles)(...FORECAST_EDIT),
    (0, _swagger.ApiOperation)({
        summary: 'Forecast accuracy metrics'
    }),
    (0, _swagger.ApiResponse)({
        status: 200,
        description: 'Accuracy metrics'
    }),
    _ts_param(0, (0, _common.Query)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _accuracyquerydto.AccuracyQueryDto === "undefined" ? Object : _accuracyquerydto.AccuracyQueryDto
    ]),
    _ts_metadata("design:returntype", void 0)
], ForecastsController.prototype, "getAccuracy", null);
_ts_decorate([
    (0, _common.Post)('generate'),
    (0, _common.UseGuards)(_rolesguard.RolesGuard),
    (0, _rolesdecorator.Roles)(...FORECAST_EDIT),
    (0, _swagger.ApiOperation)({
        summary: 'Trigger forecast generation job'
    }),
    (0, _swagger.ApiResponse)({
        status: 200,
        description: 'Job started'
    }),
    _ts_param(0, (0, _common.Body)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _generateforecastsdto.GenerateForecastsDto === "undefined" ? Object : _generateforecastsdto.GenerateForecastsDto
    ]),
    _ts_metadata("design:returntype", void 0)
], ForecastsController.prototype, "generate", null);
_ts_decorate([
    (0, _common.Get)(':sku'),
    (0, _common.UseGuards)(_rolesguard.RolesGuard),
    (0, _rolesdecorator.Roles)(...FORECAST_READ),
    (0, _swagger.ApiOperation)({
        summary: 'Get forecast for SKU'
    }),
    (0, _swagger.ApiResponse)({
        status: 200,
        description: 'Forecast data'
    }),
    (0, _swagger.ApiResponse)({
        status: 404,
        description: 'SKU not found'
    }),
    _ts_param(0, (0, _common.Param)('sku')),
    _ts_param(1, (0, _common.Query)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        typeof _forecastquerydto.ForecastQueryDto === "undefined" ? Object : _forecastquerydto.ForecastQueryDto
    ]),
    _ts_metadata("design:returntype", void 0)
], ForecastsController.prototype, "getBySku", null);
_ts_decorate([
    (0, _common.Put)(':sku'),
    (0, _common.UseGuards)(_rolesguard.RolesGuard),
    (0, _rolesdecorator.Roles)(...FORECAST_EDIT),
    (0, _swagger.ApiOperation)({
        summary: 'Override forecast for SKU'
    }),
    (0, _swagger.ApiResponse)({
        status: 200,
        description: 'Override applied'
    }),
    (0, _swagger.ApiResponse)({
        status: 404,
        description: 'SKU or forecast not found'
    }),
    _ts_param(0, (0, _common.Param)('sku')),
    _ts_param(1, (0, _common.Body)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        typeof _overrideforecastdto.OverrideForecastDto === "undefined" ? Object : _overrideforecastdto.OverrideForecastDto
    ]),
    _ts_metadata("design:returntype", void 0)
], ForecastsController.prototype, "override", null);
ForecastsController = _ts_decorate([
    (0, _swagger.ApiTags)('forecasts'),
    (0, _common.Controller)('forecasts'),
    (0, _common.UseGuards)(_jwtauthguard.JwtAuthGuard),
    (0, _swagger.ApiBearerAuth)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _forecastsservice.ForecastsService === "undefined" ? Object : _forecastsservice.ForecastsService
    ])
], ForecastsController);

//# sourceMappingURL=forecasts.controller.js.map