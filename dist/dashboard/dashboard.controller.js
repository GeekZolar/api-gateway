"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "DashboardController", {
    enumerable: true,
    get: function() {
        return DashboardController;
    }
});
const _common = require("@nestjs/common");
const _swagger = require("@nestjs/swagger");
const _jwtauthguard = require("../proxy/guards/jwt-auth.guard");
const _rolesguard = require("../auth/roles.guard");
const _rolesdecorator = require("../auth/roles.decorator");
const _reportsservice = require("../reports/reports.service");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
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
let DashboardController = class DashboardController {
    getSummary() {
        return this.reportsService.getDashboardSummary();
    }
    constructor(reportsService){
        this.reportsService = reportsService;
    }
};
_ts_decorate([
    (0, _common.Get)('summary'),
    (0, _swagger.ApiOperation)({
        summary: 'Dashboard KPIs summary'
    }),
    (0, _swagger.ApiResponse)({
        status: 200,
        description: 'KPIs (stockouts, turns, value, alerts)'
    }),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", []),
    _ts_metadata("design:returntype", void 0)
], DashboardController.prototype, "getSummary", null);
DashboardController = _ts_decorate([
    (0, _swagger.ApiTags)('dashboard'),
    (0, _common.Controller)('dashboard'),
    (0, _common.UseGuards)(_jwtauthguard.JwtAuthGuard, _rolesguard.RolesGuard),
    (0, _rolesdecorator.Roles)(...ROLES),
    (0, _swagger.ApiBearerAuth)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _reportsservice.ReportsService === "undefined" ? Object : _reportsservice.ReportsService
    ])
], DashboardController);

//# sourceMappingURL=dashboard.controller.js.map