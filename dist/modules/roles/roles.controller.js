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
const _rolesservice = require("./roles.service");
const _jwtauthguard = require("../../common/guards/jwt-auth.guard");
const _permissionsguard = require("../../common/guards/permissions.guard");
const _permissionsdecorator = require("../../common/decorators/permissions.decorator");
const _publicdecorator = require("../../common/decorators/public.decorator");
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
let RolesController = class RolesController {
    async listForRegistration() {
        return this.rolesService.findForRegistration();
    }
    async findAll() {
        return this.rolesService.findAll();
    }
    async findOne(roleId) {
        return this.rolesService.findOne(roleId);
    }
    constructor(rolesService){
        this.rolesService = rolesService;
    }
};
_ts_decorate([
    (0, _common.Get)('registration'),
    (0, _publicdecorator.Public)(),
    (0, _swagger.ApiOperation)({
        summary: 'List roles available for registration (public)'
    }),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", []),
    _ts_metadata("design:returntype", Promise)
], RolesController.prototype, "listForRegistration", null);
_ts_decorate([
    (0, _common.Get)(),
    (0, _common.UseGuards)(_jwtauthguard.JwtAuthGuard, _permissionsguard.PermissionsGuard),
    (0, _permissionsdecorator.RequirePermissions)('roles.read'),
    (0, _swagger.ApiOperation)({
        summary: 'List all roles'
    }),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", []),
    _ts_metadata("design:returntype", Promise)
], RolesController.prototype, "findAll", null);
_ts_decorate([
    (0, _common.Get)(':roleId'),
    (0, _common.UseGuards)(_jwtauthguard.JwtAuthGuard, _permissionsguard.PermissionsGuard),
    (0, _permissionsdecorator.RequirePermissions)('roles.read'),
    (0, _swagger.ApiOperation)({
        summary: 'Get role by ID'
    }),
    _ts_param(0, (0, _common.Param)('roleId')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String
    ]),
    _ts_metadata("design:returntype", Promise)
], RolesController.prototype, "findOne", null);
RolesController = _ts_decorate([
    (0, _swagger.ApiTags)('roles'),
    (0, _common.Controller)('roles'),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _rolesservice.RolesService === "undefined" ? Object : _rolesservice.RolesService
    ])
], RolesController);

//# sourceMappingURL=roles.controller.js.map