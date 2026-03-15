"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "RecommendationsController", {
    enumerable: true,
    get: function() {
        return RecommendationsController;
    }
});
const _common = require("@nestjs/common");
const _swagger = require("@nestjs/swagger");
const _jwtauthguard = require("../proxy/guards/jwt-auth.guard");
const _rolesguard = require("../auth/roles.guard");
const _rolesdecorator = require("../auth/roles.decorator");
const _purchaseordersservice = require("../purchase-orders/purchase-orders.service");
const _replenishmentquerydto = require("../purchase-orders/dto/replenishment-query.dto");
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
    'forecast-editor'
];
let RecommendationsController = class RecommendationsController {
    getReplenishment(dto) {
        return this.purchaseOrdersService.getReplenishmentRecommendations(dto.warehouseId, dto.sku);
    }
    constructor(purchaseOrdersService){
        this.purchaseOrdersService = purchaseOrdersService;
    }
};
_ts_decorate([
    (0, _common.Get)('replenishment'),
    (0, _swagger.ApiOperation)({
        summary: 'Get replenishment recommendations'
    }),
    (0, _swagger.ApiResponse)({
        status: 200,
        description: 'Recommendations list'
    }),
    _ts_param(0, (0, _common.Query)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _replenishmentquerydto.ReplenishmentQueryDto === "undefined" ? Object : _replenishmentquerydto.ReplenishmentQueryDto
    ]),
    _ts_metadata("design:returntype", void 0)
], RecommendationsController.prototype, "getReplenishment", null);
RecommendationsController = _ts_decorate([
    (0, _swagger.ApiTags)('recommendations'),
    (0, _common.Controller)('recommendations'),
    (0, _common.UseGuards)(_jwtauthguard.JwtAuthGuard, _rolesguard.RolesGuard),
    (0, _rolesdecorator.Roles)(...ROLES),
    (0, _swagger.ApiBearerAuth)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _purchaseordersservice.PurchaseOrdersService === "undefined" ? Object : _purchaseordersservice.PurchaseOrdersService
    ])
], RecommendationsController);

//# sourceMappingURL=recommendations.controller.js.map