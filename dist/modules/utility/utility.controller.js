"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "UtilityController", {
    enumerable: true,
    get: function() {
        return UtilityController;
    }
});
const _common = require("@nestjs/common");
const _swagger = require("@nestjs/swagger");
const _utilityservice = require("./utility.service");
const _jwtauthguard = require("../../common/guards/jwt-auth.guard");
const _permissionsguard = require("../../common/guards/permissions.guard");
const _permissionsdecorator = require("../../common/decorators/permissions.decorator");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let UtilityController = class UtilityController {
    countries() {
        return this.utilityService.findCountries();
    }
    categories() {
        return this.utilityService.findCategories();
    }
    warehouses() {
        return this.utilityService.findWarehouses();
    }
    suppliers() {
        return this.utilityService.findSuppliers();
    }
    products() {
        return this.utilityService.findProducts();
    }
    constructor(utilityService){
        this.utilityService = utilityService;
    }
};
_ts_decorate([
    (0, _common.Get)('countries'),
    (0, _common.UseGuards)(_jwtauthguard.JwtAuthGuard, _permissionsguard.PermissionsGuard),
    (0, _permissionsdecorator.RequirePermissions)('inventory.read'),
    (0, _swagger.ApiBearerAuth)(),
    (0, _swagger.ApiOperation)({
        summary: 'List countries (snadb)'
    }),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", []),
    _ts_metadata("design:returntype", void 0)
], UtilityController.prototype, "countries", null);
_ts_decorate([
    (0, _common.Get)('categories'),
    (0, _common.UseGuards)(_jwtauthguard.JwtAuthGuard, _permissionsguard.PermissionsGuard),
    (0, _permissionsdecorator.RequirePermissions)('inventory.read'),
    (0, _swagger.ApiBearerAuth)(),
    (0, _swagger.ApiOperation)({
        summary: 'List categories (snadb)'
    }),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", []),
    _ts_metadata("design:returntype", void 0)
], UtilityController.prototype, "categories", null);
_ts_decorate([
    (0, _common.Get)('warehouses'),
    (0, _common.UseGuards)(_jwtauthguard.JwtAuthGuard, _permissionsguard.PermissionsGuard),
    (0, _permissionsdecorator.RequirePermissions)('inventory.read'),
    (0, _swagger.ApiBearerAuth)(),
    (0, _swagger.ApiOperation)({
        summary: 'List warehouses (snadb)'
    }),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", []),
    _ts_metadata("design:returntype", void 0)
], UtilityController.prototype, "warehouses", null);
_ts_decorate([
    (0, _common.Get)('suppliers'),
    (0, _common.UseGuards)(_jwtauthguard.JwtAuthGuard, _permissionsguard.PermissionsGuard),
    (0, _permissionsdecorator.RequirePermissions)('inventory.read'),
    (0, _swagger.ApiBearerAuth)(),
    (0, _swagger.ApiOperation)({
        summary: 'List suppliers (snadb)'
    }),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", []),
    _ts_metadata("design:returntype", void 0)
], UtilityController.prototype, "suppliers", null);
_ts_decorate([
    (0, _common.Get)('products'),
    (0, _common.UseGuards)(_jwtauthguard.JwtAuthGuard, _permissionsguard.PermissionsGuard),
    (0, _permissionsdecorator.RequirePermissions)('inventory.read'),
    (0, _swagger.ApiBearerAuth)(),
    (0, _swagger.ApiOperation)({
        summary: 'List products (snadb)'
    }),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", []),
    _ts_metadata("design:returntype", void 0)
], UtilityController.prototype, "products", null);
UtilityController = _ts_decorate([
    (0, _swagger.ApiTags)('utility'),
    (0, _common.Controller)('utility'),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _utilityservice.UtilityService === "undefined" ? Object : _utilityservice.UtilityService
    ])
], UtilityController);

//# sourceMappingURL=utility.controller.js.map