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
const _updaterolesdto = require("./dto/update-roles.dto");
const _jwtauthguard = require("../proxy/guards/jwt-auth.guard");
const _rolesguard = require("../auth/roles.guard");
const _rolesdecorator = require("../auth/roles.decorator");
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
    async create(dto) {
        return this.usersService.create(dto);
    }
    async register(dto) {
        return this.usersService.create(dto);
    }
    async getProfile(req) {
        return this.usersService.getProfile(req.user.userId);
    }
    async list(page, pageSize) {
        const p = page ? Number(page) : 1;
        const ps = pageSize ? Number(pageSize) : 20;
        return this.usersService.list(p, ps);
    }
    async updateProfile(req, dto) {
        return this.usersService.updateProfile(req.user.userId, dto);
    }
    async updateRoles(id, dto) {
        return this.usersService.updateRoles(id, dto.roles);
    }
    constructor(usersService){
        this.usersService = usersService;
    }
};
_ts_decorate([
    (0, _common.Post)(),
    (0, _swagger.ApiOperation)({
        summary: 'Register a new user'
    }),
    (0, _swagger.ApiResponse)({
        status: 201,
        description: 'User created'
    }),
    (0, _swagger.ApiResponse)({
        status: 409,
        description: 'Email or username already exists'
    }),
    (0, _common.HttpCode)(_common.HttpStatus.CREATED),
    _ts_param(0, (0, _common.Body)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _createuserdto.CreateUserDto === "undefined" ? Object : _createuserdto.CreateUserDto
    ]),
    _ts_metadata("design:returntype", Promise)
], UsersController.prototype, "create", null);
_ts_decorate([
    (0, _common.Post)('register'),
    (0, _swagger.ApiOperation)({
        summary: 'Register a new user (alias for POST /users)'
    }),
    (0, _swagger.ApiResponse)({
        status: 201,
        description: 'User created'
    }),
    (0, _common.HttpCode)(_common.HttpStatus.CREATED),
    _ts_param(0, (0, _common.Body)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _createuserdto.CreateUserDto === "undefined" ? Object : _createuserdto.CreateUserDto
    ]),
    _ts_metadata("design:returntype", Promise)
], UsersController.prototype, "register", null);
_ts_decorate([
    (0, _common.Get)('me'),
    (0, _swagger.ApiBearerAuth)(),
    (0, _swagger.ApiOperation)({
        summary: 'Get current user profile'
    }),
    (0, _swagger.ApiResponse)({
        status: 200,
        description: 'Current user (no password)'
    }),
    (0, _swagger.ApiResponse)({
        status: 401,
        description: 'Unauthorized'
    }),
    (0, _common.UseGuards)(_jwtauthguard.JwtAuthGuard),
    _ts_param(0, (0, _common.Req)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        Object
    ]),
    _ts_metadata("design:returntype", Promise)
], UsersController.prototype, "getProfile", null);
_ts_decorate([
    (0, _common.Get)(),
    (0, _swagger.ApiBearerAuth)(),
    (0, _swagger.ApiOperation)({
        summary: 'List users (Admin only)'
    }),
    (0, _swagger.ApiResponse)({
        status: 200,
        description: 'Paginated user list'
    }),
    (0, _swagger.ApiResponse)({
        status: 403,
        description: 'Admin only'
    }),
    (0, _common.UseGuards)(_jwtauthguard.JwtAuthGuard, _rolesguard.RolesGuard),
    (0, _rolesdecorator.Roles)('admin'),
    _ts_param(0, (0, _common.Query)('page')),
    _ts_param(1, (0, _common.Query)('pageSize')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        Number,
        Number
    ]),
    _ts_metadata("design:returntype", Promise)
], UsersController.prototype, "list", null);
_ts_decorate([
    (0, _common.Patch)(),
    (0, _swagger.ApiBearerAuth)(),
    (0, _swagger.ApiOperation)({
        summary: 'Update current user (email and/or username)'
    }),
    (0, _swagger.ApiResponse)({
        status: 200,
        description: 'Updated user'
    }),
    (0, _swagger.ApiResponse)({
        status: 401,
        description: 'Unauthorized'
    }),
    (0, _common.UseGuards)(_jwtauthguard.JwtAuthGuard),
    _ts_param(0, (0, _common.Req)()),
    _ts_param(1, (0, _common.Body)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        Object,
        typeof _updateuserdto.UpdateUserDto === "undefined" ? Object : _updateuserdto.UpdateUserDto
    ]),
    _ts_metadata("design:returntype", Promise)
], UsersController.prototype, "updateProfile", null);
_ts_decorate([
    (0, _common.Put)(':id/roles'),
    (0, _swagger.ApiBearerAuth)(),
    (0, _swagger.ApiOperation)({
        summary: 'Update user roles (Admin only)'
    }),
    (0, _swagger.ApiResponse)({
        status: 200,
        description: 'Roles updated'
    }),
    (0, _swagger.ApiResponse)({
        status: 403,
        description: 'Admin only'
    }),
    (0, _swagger.ApiResponse)({
        status: 404,
        description: 'User not found'
    }),
    (0, _common.UseGuards)(_jwtauthguard.JwtAuthGuard, _rolesguard.RolesGuard),
    (0, _rolesdecorator.Roles)('admin'),
    _ts_param(0, (0, _common.Param)('id')),
    _ts_param(1, (0, _common.Body)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        typeof _updaterolesdto.UpdateRolesDto === "undefined" ? Object : _updaterolesdto.UpdateRolesDto
    ]),
    _ts_metadata("design:returntype", Promise)
], UsersController.prototype, "updateRoles", null);
UsersController = _ts_decorate([
    (0, _swagger.ApiTags)('users'),
    (0, _common.Controller)('users'),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _usersservice.UsersService === "undefined" ? Object : _usersservice.UsersService
    ])
], UsersController);

//# sourceMappingURL=users.controller.js.map