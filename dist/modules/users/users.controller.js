"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "UsersController", {
    enumerable: true,
    get: function() {
        return UsersController;
    }
});
const _common = require("@nestjs/common");
const _swagger = require("@nestjs/swagger");
const _usersservice = require("./users.service");
const _createuserdto = require("./dto/create-user.dto");
const _updateuserdto = require("./dto/update-user.dto");
const _userstatusdto = require("./dto/user-status.dto");
const _userquerydto = require("./dto/user-query.dto");
const _changepassworddto = require("../auth/dto/change-password.dto");
const _jwtauthguard = require("../../common/guards/jwt-auth.guard");
const _permissionsguard = require("../../common/guards/permissions.guard");
const _permissionsdecorator = require("../../common/decorators/permissions.decorator");
const _currentuserdecorator = require("../../common/decorators/current-user.decorator");
const _requestwithuserinterface = require("../../common/interfaces/request-with-user.interface");
const _validatorsutil = require("../../utils/validators.util");
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
let UsersController = class UsersController {
    async create(dto, req) {
        const createdBy = req.user?.userId;
        return this.usersService.create(dto, createdBy, req.ip, req.headers['user-agent']);
    }
    async approve(userId, approvedBy, req) {
        return this.usersService.approve(userId, approvedBy, req.ip, req.headers['user-agent']);
    }
    async update(userId, dto, user, req) {
        const isAdmin = user && (0, _validatorsutil.hasPermission)(user.permissions, 'users.approve');
        return this.usersService.update(userId, dto, user.userId, isAdmin, req.ip, req.headers['user-agent']);
    }
    async setStatus(userId, dto, updatedBy, req) {
        return this.usersService.setStatus(userId, dto.isActive, updatedBy, req.ip, req.headers['user-agent']);
    }
    async findAll(query) {
        return this.usersService.findPaginated(query);
    }
    async findOne(userId) {
        return this.usersService.findOne(userId);
    }
    async changePassword(userId, dto, req) {
        return this.usersService.changePassword(userId, dto.currentPassword, dto.newPassword, dto.confirmPassword, req.ip, req.headers['user-agent']);
    }
    constructor(usersService){
        this.usersService = usersService;
    }
};
_ts_decorate([
    (0, _common.Post)('create'),
    (0, _swagger.ApiOperation)({
        summary: 'Create user (registration)'
    }),
    _ts_param(0, (0, _common.Body)()),
    _ts_param(1, (0, _common.Req)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _createuserdto.CreateUserDto === "undefined" ? Object : _createuserdto.CreateUserDto,
        typeof _requestwithuserinterface.RequestWithUser === "undefined" ? Object : _requestwithuserinterface.RequestWithUser
    ]),
    _ts_metadata("design:returntype", Promise)
], UsersController.prototype, "create", null);
_ts_decorate([
    (0, _common.Patch)(':userId/approve'),
    (0, _common.UseGuards)(_jwtauthguard.JwtAuthGuard, _permissionsguard.PermissionsGuard),
    (0, _swagger.ApiBearerAuth)(),
    (0, _permissionsdecorator.RequirePermissions)('users.approve'),
    (0, _swagger.ApiOperation)({
        summary: 'Approve user'
    }),
    _ts_param(0, (0, _common.Param)('userId')),
    _ts_param(1, (0, _currentuserdecorator.CurrentUser)('userId')),
    _ts_param(2, (0, _common.Req)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        String,
        typeof _requestwithuserinterface.RequestWithUser === "undefined" ? Object : _requestwithuserinterface.RequestWithUser
    ]),
    _ts_metadata("design:returntype", Promise)
], UsersController.prototype, "approve", null);
_ts_decorate([
    (0, _common.Patch)(':userId'),
    (0, _common.UseGuards)(_jwtauthguard.JwtAuthGuard, _permissionsguard.PermissionsGuard),
    (0, _permissionsdecorator.RequirePermissions)('users.update'),
    (0, _swagger.ApiOperation)({
        summary: 'Update user'
    }),
    _ts_param(0, (0, _common.Param)('userId')),
    _ts_param(1, (0, _common.Body)()),
    _ts_param(2, (0, _currentuserdecorator.CurrentUser)()),
    _ts_param(3, (0, _common.Req)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        typeof _updateuserdto.UpdateUserDto === "undefined" ? Object : _updateuserdto.UpdateUserDto,
        Object,
        typeof _requestwithuserinterface.RequestWithUser === "undefined" ? Object : _requestwithuserinterface.RequestWithUser
    ]),
    _ts_metadata("design:returntype", Promise)
], UsersController.prototype, "update", null);
_ts_decorate([
    (0, _common.Patch)(':userId/status'),
    (0, _common.UseGuards)(_jwtauthguard.JwtAuthGuard, _permissionsguard.PermissionsGuard),
    (0, _permissionsdecorator.RequirePermissions)('users.update'),
    (0, _swagger.ApiOperation)({
        summary: 'Activate/deactivate user'
    }),
    _ts_param(0, (0, _common.Param)('userId')),
    _ts_param(1, (0, _common.Body)()),
    _ts_param(2, (0, _currentuserdecorator.CurrentUser)('userId')),
    _ts_param(3, (0, _common.Req)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        typeof _userstatusdto.UserStatusDto === "undefined" ? Object : _userstatusdto.UserStatusDto,
        String,
        typeof _requestwithuserinterface.RequestWithUser === "undefined" ? Object : _requestwithuserinterface.RequestWithUser
    ]),
    _ts_metadata("design:returntype", Promise)
], UsersController.prototype, "setStatus", null);
_ts_decorate([
    (0, _common.Get)(),
    (0, _common.UseGuards)(_jwtauthguard.JwtAuthGuard, _permissionsguard.PermissionsGuard),
    (0, _swagger.ApiBearerAuth)(),
    (0, _permissionsdecorator.RequirePermissions)('users.read'),
    (0, _swagger.ApiOperation)({
        summary: 'List users with pagination'
    }),
    _ts_param(0, (0, _common.Query)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _userquerydto.UserQueryDto === "undefined" ? Object : _userquerydto.UserQueryDto
    ]),
    _ts_metadata("design:returntype", Promise)
], UsersController.prototype, "findAll", null);
_ts_decorate([
    (0, _common.Get)(':userId'),
    (0, _common.UseGuards)(_jwtauthguard.JwtAuthGuard, _permissionsguard.PermissionsGuard),
    (0, _permissionsdecorator.RequirePermissions)('users.read'),
    (0, _swagger.ApiOperation)({
        summary: 'Get user by ID'
    }),
    _ts_param(0, (0, _common.Param)('userId')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String
    ]),
    _ts_metadata("design:returntype", Promise)
], UsersController.prototype, "findOne", null);
_ts_decorate([
    (0, _common.Post)('change-password'),
    (0, _common.UseGuards)(_jwtauthguard.JwtAuthGuard),
    (0, _swagger.ApiOperation)({
        summary: 'Change own password'
    }),
    _ts_param(0, (0, _currentuserdecorator.CurrentUser)('userId')),
    _ts_param(1, (0, _common.Body)()),
    _ts_param(2, (0, _common.Req)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        typeof _changepassworddto.ChangePasswordDto === "undefined" ? Object : _changepassworddto.ChangePasswordDto,
        typeof _requestwithuserinterface.RequestWithUser === "undefined" ? Object : _requestwithuserinterface.RequestWithUser
    ]),
    _ts_metadata("design:returntype", Promise)
], UsersController.prototype, "changePassword", null);
UsersController = _ts_decorate([
    (0, _swagger.ApiTags)('users'),
    (0, _common.Controller)('users'),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _usersservice.UsersService === "undefined" ? Object : _usersservice.UsersService
    ])
], UsersController);

//# sourceMappingURL=users.controller.js.map