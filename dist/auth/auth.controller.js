"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "AuthController", {
    enumerable: true,
    get: function() {
        return AuthController;
    }
});
const _common = require("@nestjs/common");
const _swagger = require("@nestjs/swagger");
const _throttler = require("@nestjs/throttler");
const _authservice = require("./auth.service");
const _logindto = require("./dto/login.dto");
const _refreshdto = require("./dto/refresh.dto");
const _passwordresetrequestdto = require("./dto/password-reset-request.dto");
const _passwordresetconfirmdto = require("./dto/password-reset-confirm.dto");
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
let AuthController = class AuthController {
    async login(dto) {
        return this.authService.login(dto);
    }
    async refresh(dto) {
        return this.authService.refresh(dto);
    }
    async logout() {
        return this.authService.logout();
    }
    async passwordResetRequest(dto) {
        return this.authService.passwordResetRequest(dto);
    }
    async passwordResetConfirm(dto) {
        return this.authService.passwordResetConfirm(dto);
    }
    constructor(authService){
        this.authService = authService;
    }
};
_ts_decorate([
    (0, _common.Post)('login'),
    (0, _swagger.ApiOperation)({
        summary: 'Login with username and password'
    }),
    (0, _swagger.ApiResponse)({
        status: 200,
        description: 'Returns accessToken and refreshToken'
    }),
    (0, _swagger.ApiResponse)({
        status: 401,
        description: 'Invalid credentials'
    }),
    (0, _throttler.Throttle)({
        default: {
            limit: 5,
            ttl: 900000
        }
    }),
    _ts_param(0, (0, _common.Body)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _logindto.LoginDto === "undefined" ? Object : _logindto.LoginDto
    ]),
    _ts_metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
_ts_decorate([
    (0, _common.Post)('refresh'),
    (0, _swagger.ApiOperation)({
        summary: 'Get new access token using refresh token'
    }),
    (0, _swagger.ApiResponse)({
        status: 200,
        description: 'Returns new accessToken'
    }),
    (0, _swagger.ApiResponse)({
        status: 401,
        description: 'Invalid or expired refresh token'
    }),
    _ts_param(0, (0, _common.Body)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _refreshdto.RefreshDto === "undefined" ? Object : _refreshdto.RefreshDto
    ]),
    _ts_metadata("design:returntype", Promise)
], AuthController.prototype, "refresh", null);
_ts_decorate([
    (0, _common.Post)('logout'),
    (0, _swagger.ApiOperation)({
        summary: 'Logout (client should discard token)'
    }),
    (0, _swagger.ApiResponse)({
        status: 200,
        description: 'Logged out'
    }),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", []),
    _ts_metadata("design:returntype", Promise)
], AuthController.prototype, "logout", null);
_ts_decorate([
    (0, _common.Post)('password-reset/request'),
    (0, _swagger.ApiOperation)({
        summary: 'Request password reset email'
    }),
    (0, _swagger.ApiResponse)({
        status: 200,
        description: 'In dev, response may include token for testing'
    }),
    (0, _throttler.Throttle)({
        default: {
            limit: 3,
            ttl: 900000
        }
    }),
    _ts_param(0, (0, _common.Body)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _passwordresetrequestdto.PasswordResetRequestDto === "undefined" ? Object : _passwordresetrequestdto.PasswordResetRequestDto
    ]),
    _ts_metadata("design:returntype", Promise)
], AuthController.prototype, "passwordResetRequest", null);
_ts_decorate([
    (0, _common.Post)('password-reset/confirm'),
    (0, _swagger.ApiOperation)({
        summary: 'Confirm password reset with token and new password'
    }),
    (0, _swagger.ApiResponse)({
        status: 200,
        description: 'Password reset successfully'
    }),
    (0, _swagger.ApiResponse)({
        status: 400,
        description: 'Invalid or expired token'
    }),
    _ts_param(0, (0, _common.Body)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _passwordresetconfirmdto.PasswordResetConfirmDto === "undefined" ? Object : _passwordresetconfirmdto.PasswordResetConfirmDto
    ]),
    _ts_metadata("design:returntype", Promise)
], AuthController.prototype, "passwordResetConfirm", null);
AuthController = _ts_decorate([
    (0, _swagger.ApiTags)('auth'),
    (0, _common.Controller)('auth'),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _authservice.AuthService === "undefined" ? Object : _authservice.AuthService
    ])
], AuthController);

//# sourceMappingURL=auth.controller.js.map