"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "InventoryController", {
    enumerable: true,
    get: function() {
        return InventoryController;
    }
});
const _common = require("@nestjs/common");
const _swagger = require("@nestjs/swagger");
const _jwtauthguard = require("../proxy/guards/jwt-auth.guard");
const _rolesguard = require("../auth/roles.guard");
const _rolesdecorator = require("../auth/roles.decorator");
const _inventoryservice = require("./inventory.service");
const _filterinventorydto = require("./dto/filter-inventory.dto");
const _adjustinventorydto = require("./dto/adjust-inventory.dto");
const _createtransferdto = require("./dto/create-transfer.dto");
const _expiringquerydto = require("./dto/expiring-query.dto");
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
const ALL_INVENTORY_ROLES = [
    'admin',
    'inventory-manager',
    'po-creator',
    'po-approver',
    'forecast-editor',
    'read-only',
    'user'
];
const EDIT_INVENTORY_ROLES = [
    'admin',
    'inventory-manager'
];
let InventoryController = class InventoryController {
    list(dto, req) {
        return this.inventoryService.list(dto, req.user?.userId);
    }
    expiring(dto) {
        return this.inventoryService.getExpiring(dto.days ?? 120, dto.warehouseId);
    }
    getBySku(sku) {
        return this.inventoryService.getBySku(sku);
    }
    adjust(dto, req) {
        return this.inventoryService.adjust(dto, req.user?.userId);
    }
    createTransfer(dto, req) {
        return this.inventoryService.createTransfer(dto, req.user?.userId);
    }
    constructor(inventoryService){
        this.inventoryService = inventoryService;
    }
};
_ts_decorate([
    (0, _common.Get)(),
    (0, _common.UseGuards)(_rolesguard.RolesGuard),
    (0, _rolesdecorator.Roles)(...ALL_INVENTORY_ROLES),
    (0, _swagger.ApiBearerAuth)(),
    (0, _swagger.ApiOperation)({
        summary: 'List inventory with filters'
    }),
    (0, _swagger.ApiResponse)({
        status: 200,
        description: 'Paginated inventory list'
    }),
    _ts_param(0, (0, _common.Query)()),
    _ts_param(1, (0, _common.Req)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _filterinventorydto.FilterInventoryDto === "undefined" ? Object : _filterinventorydto.FilterInventoryDto,
        Object
    ]),
    _ts_metadata("design:returntype", void 0)
], InventoryController.prototype, "list", null);
_ts_decorate([
    (0, _common.Get)('expiring'),
    (0, _common.UseGuards)(_rolesguard.RolesGuard),
    (0, _rolesdecorator.Roles)(...ALL_INVENTORY_ROLES),
    (0, _swagger.ApiBearerAuth)(),
    (0, _swagger.ApiOperation)({
        summary: 'Get expiring inventory within window'
    }),
    (0, _swagger.ApiResponse)({
        status: 200,
        description: 'List of expiring items'
    }),
    _ts_param(0, (0, _common.Query)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _expiringquerydto.ExpiringQueryDto === "undefined" ? Object : _expiringquerydto.ExpiringQueryDto
    ]),
    _ts_metadata("design:returntype", void 0)
], InventoryController.prototype, "expiring", null);
_ts_decorate([
    (0, _common.Get)(':sku'),
    (0, _common.UseGuards)(_rolesguard.RolesGuard),
    (0, _rolesdecorator.Roles)(...ALL_INVENTORY_ROLES),
    (0, _swagger.ApiBearerAuth)(),
    (0, _swagger.ApiOperation)({
        summary: 'Get inventory details by SKU'
    }),
    (0, _swagger.ApiResponse)({
        status: 200,
        description: 'SKU details by location'
    }),
    (0, _swagger.ApiResponse)({
        status: 404,
        description: 'SKU not found'
    }),
    _ts_param(0, (0, _common.Param)('sku')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String
    ]),
    _ts_metadata("design:returntype", void 0)
], InventoryController.prototype, "getBySku", null);
_ts_decorate([
    (0, _common.Post)('adjust'),
    (0, _common.UseGuards)(_rolesguard.RolesGuard),
    (0, _rolesdecorator.Roles)(...EDIT_INVENTORY_ROLES),
    (0, _swagger.ApiBearerAuth)(),
    (0, _swagger.ApiOperation)({
        summary: 'Create inventory adjustment'
    }),
    (0, _swagger.ApiResponse)({
        status: 200,
        description: 'Adjustment applied'
    }),
    (0, _swagger.ApiResponse)({
        status: 403,
        description: 'Insufficient permissions'
    }),
    _ts_param(0, (0, _common.Body)()),
    _ts_param(1, (0, _common.Req)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _adjustinventorydto.AdjustInventoryDto === "undefined" ? Object : _adjustinventorydto.AdjustInventoryDto,
        Object
    ]),
    _ts_metadata("design:returntype", void 0)
], InventoryController.prototype, "adjust", null);
_ts_decorate([
    (0, _common.Post)('transfer'),
    (0, _common.UseGuards)(_rolesguard.RolesGuard),
    (0, _rolesdecorator.Roles)(...EDIT_INVENTORY_ROLES),
    (0, _swagger.ApiBearerAuth)(),
    (0, _swagger.ApiOperation)({
        summary: 'Create stock transfer between warehouses'
    }),
    (0, _swagger.ApiResponse)({
        status: 201,
        description: 'Transfer created'
    }),
    (0, _swagger.ApiResponse)({
        status: 403,
        description: 'Insufficient permissions'
    }),
    _ts_param(0, (0, _common.Body)()),
    _ts_param(1, (0, _common.Req)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _createtransferdto.CreateTransferDto === "undefined" ? Object : _createtransferdto.CreateTransferDto,
        Object
    ]),
    _ts_metadata("design:returntype", void 0)
], InventoryController.prototype, "createTransfer", null);
InventoryController = _ts_decorate([
    (0, _swagger.ApiTags)('inventory'),
    (0, _common.Controller)('inventory'),
    (0, _common.UseGuards)(_jwtauthguard.JwtAuthGuard),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _inventoryservice.InventoryService === "undefined" ? Object : _inventoryservice.InventoryService
    ])
], InventoryController);

//# sourceMappingURL=inventory.controller.js.map