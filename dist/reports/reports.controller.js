"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "ReportsController", {
    enumerable: true,
    get: function() {
        return ReportsController;
    }
});
const _common = require("@nestjs/common");
const _swagger = require("@nestjs/swagger");
const _jwtauthguard = require("../proxy/guards/jwt-auth.guard");
const _rolesguard = require("../auth/roles.guard");
const _rolesdecorator = require("../auth/roles.decorator");
const _reportsservice = require("./reports.service");
const _exportreportdto = require("./dto/export-report.dto");
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
const ROLES = [
    'admin',
    'inventory-manager',
    'po-creator',
    'po-approver',
    'forecast-editor',
    'read-only',
    'user'
];
let ReportsController = class ReportsController {
    getCurrentInventory() {
        return this.reportsService.getCurrentInventory();
    }
    getValuation() {
        return this.reportsService.getValuation();
    }
    getVariance() {
        return this.reportsService.getVariance();
    }
    export(dto) {
        return this.reportsService.exportReport(dto.type, dto.format, dto.filters);
    }
    constructor(reportsService){
        this.reportsService = reportsService;
    }
};
_ts_decorate([
    (0, _common.Get)('current-inventory'),
    (0, _swagger.ApiOperation)({
        summary: 'Current inventory report'
    }),
    (0, _swagger.ApiResponse)({
        status: 200,
        description: 'Inventory snapshot'
    }),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", []),
    _ts_metadata("design:returntype", void 0)
], ReportsController.prototype, "getCurrentInventory", null);
_ts_decorate([
    (0, _common.Get)('valuation'),
    (0, _swagger.ApiOperation)({
        summary: 'Inventory valuation report'
    }),
    (0, _swagger.ApiResponse)({
        status: 200,
        description: 'Valuation by SKU/warehouse'
    }),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", []),
    _ts_metadata("design:returntype", void 0)
], ReportsController.prototype, "getValuation", null);
_ts_decorate([
    (0, _common.Get)('variance'),
    (0, _swagger.ApiOperation)({
        summary: 'Reconciliation variance report'
    }),
    (0, _swagger.ApiResponse)({
        status: 200,
        description: 'Book vs physical variance'
    }),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", []),
    _ts_metadata("design:returntype", void 0)
], ReportsController.prototype, "getVariance", null);
_ts_decorate([
    (0, _common.Post)('export'),
    (0, _swagger.ApiOperation)({
        summary: 'Export report'
    }),
    (0, _swagger.ApiResponse)({
        status: 200,
        description: 'Export job queued'
    }),
    _ts_param(0, (0, _common.Body)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _exportreportdto.ExportReportDto === "undefined" ? Object : _exportreportdto.ExportReportDto
    ]),
    _ts_metadata("design:returntype", void 0)
], ReportsController.prototype, "export", null);
ReportsController = _ts_decorate([
    (0, _swagger.ApiTags)('reports'),
    (0, _common.Controller)('reports'),
    (0, _common.UseGuards)(_jwtauthguard.JwtAuthGuard, _rolesguard.RolesGuard),
    (0, _rolesdecorator.Roles)(...ROLES),
    (0, _swagger.ApiBearerAuth)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _reportsservice.ReportsService === "undefined" ? Object : _reportsservice.ReportsService
    ])
], ReportsController);

//# sourceMappingURL=reports.controller.js.map