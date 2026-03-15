"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "ProductsController", {
    enumerable: true,
    get: function() {
        return ProductsController;
    }
});
const _common = require("@nestjs/common");
const _swagger = require("@nestjs/swagger");
const _jwtauthguard = require("../proxy/guards/jwt-auth.guard");
const _rolesguard = require("../auth/roles.guard");
const _rolesdecorator = require("../auth/roles.decorator");
const _inventoryservice = require("./inventory.service");
const _createproductdto = require("./dto/create-product.dto");
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
const EDIT_ROLES = [
    'admin',
    'inventory-manager'
];
let ProductsController = class ProductsController {
    list() {
        return this.inventoryService.listProducts();
    }
    create(dto) {
        return this.inventoryService.createProduct(dto);
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
        summary: 'List all products'
    }),
    (0, _swagger.ApiResponse)({
        status: 200,
        description: 'List of products'
    }),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", []),
    _ts_metadata("design:returntype", void 0)
], ProductsController.prototype, "list", null);
_ts_decorate([
    (0, _common.Post)(),
    (0, _common.HttpCode)(_common.HttpStatus.CREATED),
    (0, _common.UseGuards)(_rolesguard.RolesGuard),
    (0, _rolesdecorator.Roles)(...EDIT_ROLES),
    (0, _swagger.ApiBearerAuth)(),
    (0, _swagger.ApiOperation)({
        summary: 'Create a product'
    }),
    (0, _swagger.ApiResponse)({
        status: 201,
        description: 'Product created'
    }),
    (0, _swagger.ApiResponse)({
        status: 409,
        description: 'Product SKU already exists'
    }),
    _ts_param(0, (0, _common.Body)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _createproductdto.CreateProductDto === "undefined" ? Object : _createproductdto.CreateProductDto
    ]),
    _ts_metadata("design:returntype", void 0)
], ProductsController.prototype, "create", null);
ProductsController = _ts_decorate([
    (0, _swagger.ApiTags)('products'),
    (0, _common.Controller)('products'),
    (0, _common.UseGuards)(_jwtauthguard.JwtAuthGuard),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _inventoryservice.InventoryService === "undefined" ? Object : _inventoryservice.InventoryService
    ])
], ProductsController);

//# sourceMappingURL=products.controller.js.map