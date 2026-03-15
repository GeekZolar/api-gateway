"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "PurchaseOrdersController", {
    enumerable: true,
    get: function() {
        return PurchaseOrdersController;
    }
});
const _common = require("@nestjs/common");
const _swagger = require("@nestjs/swagger");
const _jwtauthguard = require("../proxy/guards/jwt-auth.guard");
const _rolesguard = require("../auth/roles.guard");
const _rolesdecorator = require("../auth/roles.decorator");
const _purchaseordersservice = require("./purchase-orders.service");
const _listpurchaseordersdto = require("./dto/list-purchase-orders.dto");
const _createpurchaseorderdto = require("./dto/create-purchase-order.dto");
const _approvepurchaseorderdto = require("./dto/approve-purchase-order.dto");
const _receivepurchaseorderdto = require("./dto/receive-purchase-order.dto");
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
const PO_LIST_ROLES = [
    'admin',
    'inventory-manager',
    'po-creator',
    'po-approver'
];
const PO_CREATE_ROLES = [
    'admin',
    'inventory-manager',
    'po-creator'
];
const PO_APPROVE_ROLES = [
    'admin',
    'po-approver'
];
const PO_RECEIVE_ROLES = [
    'admin',
    'inventory-manager'
];
let PurchaseOrdersController = class PurchaseOrdersController {
    list(dto) {
        return this.purchaseOrdersService.list(dto);
    }
    create(dto, req) {
        return this.purchaseOrdersService.create(dto, req.user?.userId);
    }
    approve(id, dto, req) {
        return this.purchaseOrdersService.approve(id, req.user.userId, dto.comment);
    }
    receive(id, dto, req) {
        return this.purchaseOrdersService.receive(id, dto, req.user?.userId);
    }
    constructor(purchaseOrdersService){
        this.purchaseOrdersService = purchaseOrdersService;
    }
};
_ts_decorate([
    (0, _common.Get)(),
    (0, _common.UseGuards)(_rolesguard.RolesGuard),
    (0, _rolesdecorator.Roles)(...PO_LIST_ROLES),
    (0, _swagger.ApiOperation)({
        summary: 'List purchase orders'
    }),
    (0, _swagger.ApiResponse)({
        status: 200,
        description: 'Paginated list'
    }),
    _ts_param(0, (0, _common.Query)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _listpurchaseordersdto.ListPurchaseOrdersDto === "undefined" ? Object : _listpurchaseordersdto.ListPurchaseOrdersDto
    ]),
    _ts_metadata("design:returntype", void 0)
], PurchaseOrdersController.prototype, "list", null);
_ts_decorate([
    (0, _common.Post)(),
    (0, _common.UseGuards)(_rolesguard.RolesGuard),
    (0, _rolesdecorator.Roles)(...PO_CREATE_ROLES),
    (0, _common.HttpCode)(_common.HttpStatus.CREATED),
    (0, _swagger.ApiOperation)({
        summary: 'Create purchase order'
    }),
    (0, _swagger.ApiResponse)({
        status: 201,
        description: 'PO created'
    }),
    _ts_param(0, (0, _common.Body)()),
    _ts_param(1, (0, _common.Req)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _createpurchaseorderdto.CreatePurchaseOrderDto === "undefined" ? Object : _createpurchaseorderdto.CreatePurchaseOrderDto,
        Object
    ]),
    _ts_metadata("design:returntype", void 0)
], PurchaseOrdersController.prototype, "create", null);
_ts_decorate([
    (0, _common.Put)(':id/approve'),
    (0, _common.UseGuards)(_rolesguard.RolesGuard),
    (0, _rolesdecorator.Roles)(...PO_APPROVE_ROLES),
    (0, _swagger.ApiOperation)({
        summary: 'Approve purchase order'
    }),
    (0, _swagger.ApiResponse)({
        status: 200,
        description: 'PO approved'
    }),
    _ts_param(0, (0, _common.Param)('id')),
    _ts_param(1, (0, _common.Body)()),
    _ts_param(2, (0, _common.Req)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        typeof _approvepurchaseorderdto.ApprovePurchaseOrderDto === "undefined" ? Object : _approvepurchaseorderdto.ApprovePurchaseOrderDto,
        Object
    ]),
    _ts_metadata("design:returntype", void 0)
], PurchaseOrdersController.prototype, "approve", null);
_ts_decorate([
    (0, _common.Post)(':id/receive'),
    (0, _common.UseGuards)(_rolesguard.RolesGuard),
    (0, _rolesdecorator.Roles)(...PO_RECEIVE_ROLES),
    (0, _swagger.ApiOperation)({
        summary: 'Record PO receipt'
    }),
    (0, _swagger.ApiResponse)({
        status: 200,
        description: 'Receipt recorded'
    }),
    _ts_param(0, (0, _common.Param)('id')),
    _ts_param(1, (0, _common.Body)()),
    _ts_param(2, (0, _common.Req)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        typeof _receivepurchaseorderdto.ReceivePurchaseOrderDto === "undefined" ? Object : _receivepurchaseorderdto.ReceivePurchaseOrderDto,
        Object
    ]),
    _ts_metadata("design:returntype", void 0)
], PurchaseOrdersController.prototype, "receive", null);
PurchaseOrdersController = _ts_decorate([
    (0, _swagger.ApiTags)('purchase-orders'),
    (0, _common.Controller)('purchase-orders'),
    (0, _common.UseGuards)(_jwtauthguard.JwtAuthGuard),
    (0, _swagger.ApiBearerAuth)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _purchaseordersservice.PurchaseOrdersService === "undefined" ? Object : _purchaseordersservice.PurchaseOrdersService
    ])
], PurchaseOrdersController);

//# sourceMappingURL=purchase-orders.controller.js.map