"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "RolesController", {
    enumerable: true,
    get: function() {
        return RolesController;
    }
});
const _common = require("@nestjs/common");
const _swagger = require("@nestjs/swagger");
const _jwtauthguard = require("../proxy/guards/jwt-auth.guard");
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
    {
        id: 'user',
        name: 'User'
    },
    {
        id: 'admin',
        name: 'Admin'
    },
    {
        id: 'inventory-manager',
        name: 'Inventory Manager'
    },
    {
        id: 'po-creator',
        name: 'PO Creator'
    },
    {
        id: 'po-approver',
        name: 'PO Approver'
    },
    {
        id: 'forecast-editor',
        name: 'Forecast Editor'
    },
    {
        id: 'read-only',
        name: 'Read-Only User'
    }
];
let RolesController = class RolesController {
    findAll() {
        return ROLES;
    }
    registration() {
        return ROLES;
    }
};
_ts_decorate([
    (0, _common.Get)(),
    (0, _swagger.ApiBearerAuth)(),
    (0, _swagger.ApiOperation)({
        summary: 'List all roles (authenticated)'
    }),
    (0, _swagger.ApiResponse)({
        status: 200,
        description: 'List of roles'
    }),
    (0, _common.UseGuards)(_jwtauthguard.JwtAuthGuard),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", []),
    _ts_metadata("design:returntype", void 0)
], RolesController.prototype, "findAll", null);
_ts_decorate([
    (0, _common.Get)('registration'),
    (0, _swagger.ApiOperation)({
        summary: 'List roles for registration (public)'
    }),
    (0, _swagger.ApiResponse)({
        status: 200,
        description: 'List of roles'
    }),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", []),
    _ts_metadata("design:returntype", void 0)
], RolesController.prototype, "registration", null);
RolesController = _ts_decorate([
    (0, _swagger.ApiTags)('roles'),
    (0, _common.Controller)('roles')
], RolesController);

//# sourceMappingURL=roles.controller.js.map