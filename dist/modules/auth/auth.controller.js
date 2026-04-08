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
const _throttler = require("@nestjs/throttler");
const _swagger = require("@nestjs/swagger");
const _authservice = require("./auth.service");
const _logindto = require("./dto/login.dto");
const _refreshtokendto = require("./dto/refresh-token.dto");
const _mfaverifydto = require("./dto/mfa-verify.dto");
const _mfasetupdto = require("./dto/mfa-setup.dto");
const _mfaloginverifydto = require("./dto/mfa-login-verify.dto");
const _passwordresetdto = require("./dto/password-reset.dto");
const _jwtauthguard = require("../../common/guards/jwt-auth.guard");
const _jwtrefreshguard = require("../../common/guards/jwt-refresh.guard");
const _currentuserdecorator = require("../../common/decorators/current-user.decorator");
const _requestwithuserinterface = require("../../common/interfaces/request-with-user.interface");
const _userentity = require("../users/entities/user.entity");
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
    async login(dto, req) {
        const ip = req.ip;
        const ua = req.headers['user-agent'];
        return this.authService.login(dto.username, dto.password, ip, ua);
    }
    async verifyMfaAndLogin(dto, req) {
        const ip = req.ip;
        const ua = req.headers['user-agent'];
        return this.authService.verifyMfaAndLogin(dto.mfaToken, dto.mfaCode, ip, ua);
    }
    async refresh(dto, req) {
        const ip = req.ip;
        const ua = req.headers['user-agent'];
        const user = req.user;
        return this.authService.refresh(user, dto.refreshToken, ip, ua);
    }
    async logout(userId, sessionId) {
        return this.authService.logout(userId, sessionId);
    }
    async mfaSetup(user, dto) {
        return this.authService.mfaSetup(user, dto.emailAddress);
    }
    async mfaVerify(userId, dto) {
        return this.authService.mfaVerify(userId, dto.code);
    }
    async mfaVerifyAndDisable(userId, dto) {
        return this.authService.mfaVerifyAndDisable(userId, dto.code);
    }
    async passwordResetRequest(dto, req) {
        return this.authService.passwordResetRequest(dto.email, req.ip);
    }
    async passwordResetConfirm(dto) {
        return this.authService.passwordResetConfirm(dto.token, dto.newPassword);
    }
    async getSessions(userId, sessionId) {
        return this.authService.getActiveSessions(userId, sessionId);
    }
    async revokeSession(userId, sessionId) {
        return this.authService.revokeSession(userId, sessionId);
    }
    constructor(authService){
        this.authService = authService;
    }
};
_ts_decorate([
    (0, _common.Post)('login'),
    (0, _throttler.Throttle)({
        default: {
            limit: 5,
            ttl: 900000
        }
    }),
    (0, _swagger.ApiOperation)({
        summary: 'Login with username and password'
    }),
    _ts_param(0, (0, _common.Body)()),
    _ts_param(1, (0, _common.Req)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _logindto.LoginDto === "undefined" ? Object : _logindto.LoginDto,
        typeof _requestwithuserinterface.RequestWithUser === "undefined" ? Object : _requestwithuserinterface.RequestWithUser
    ]),
    _ts_metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
_ts_decorate([
    (0, _common.Post)('mfa/verify-login'),
    (0, _throttler.Throttle)({
        default: {
            limit: 5,
            ttl: 900000
        }
    }),
    (0, _swagger.ApiOperation)({
        summary: 'Verify MFA code and complete login'
    }),
    _ts_param(0, (0, _common.Body)()),
    _ts_param(1, (0, _common.Req)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _mfaloginverifydto.MfaLoginVerifyDto === "undefined" ? Object : _mfaloginverifydto.MfaLoginVerifyDto,
        typeof _requestwithuserinterface.RequestWithUser === "undefined" ? Object : _requestwithuserinterface.RequestWithUser
    ]),
    _ts_metadata("design:returntype", Promise)
], AuthController.prototype, "verifyMfaAndLogin", null);
_ts_decorate([
    (0, _common.Post)('refresh'),
    (0, _common.UseGuards)(_jwtrefreshguard.JwtRefreshGuard),
    (0, _swagger.ApiOperation)({
        summary: 'Refresh access token'
    }),
    _ts_param(0, (0, _common.Body)()),
    _ts_param(1, (0, _common.Req)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _refreshtokendto.RefreshTokenDto === "undefined" ? Object : _refreshtokendto.RefreshTokenDto,
        typeof _requestwithuserinterface.RequestWithUser === "undefined" ? Object : _requestwithuserinterface.RequestWithUser
    ]),
    _ts_metadata("design:returntype", Promise)
], AuthController.prototype, "refresh", null);
_ts_decorate([
    (0, _common.Post)('logout'),
    (0, _common.UseGuards)(_jwtauthguard.JwtAuthGuard),
    (0, _swagger.ApiOperation)({
        summary: 'Logout'
    }),
    _ts_param(0, (0, _currentuserdecorator.CurrentUser)('userId')),
    _ts_param(1, (0, _currentuserdecorator.CurrentUser)('sessionId')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        String
    ]),
    _ts_metadata("design:returntype", Promise)
], AuthController.prototype, "logout", null);
_ts_decorate([
    (0, _common.Post)('mfa/setup'),
    (0, _common.UseGuards)(_jwtauthguard.JwtAuthGuard),
    (0, _swagger.ApiBearerAuth)(),
    (0, _swagger.ApiOperation)({
        summary: 'Setup MFA (Google/Microsoft Authenticator)',
        description: 'Requires the **access token** in the Authorization header (Bearer). Use the accessToken from login, or from POST /auth/mfa/verify-login if login returned mfaRequired.'
    }),
    _ts_param(0, (0, _currentuserdecorator.CurrentUser)()),
    _ts_param(1, (0, _common.Body)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _userentity.User === "undefined" ? Object : _userentity.User,
        typeof _mfasetupdto.MfaSetupDto === "undefined" ? Object : _mfasetupdto.MfaSetupDto
    ]),
    _ts_metadata("design:returntype", Promise)
], AuthController.prototype, "mfaSetup", null);
_ts_decorate([
    (0, _common.Post)('mfa/verify'),
    (0, _common.UseGuards)(_jwtauthguard.JwtAuthGuard),
    (0, _swagger.ApiOperation)({
        summary: 'Verify MFA and enable'
    }),
    _ts_param(0, (0, _currentuserdecorator.CurrentUser)('userId')),
    _ts_param(1, (0, _common.Body)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        typeof _mfaverifydto.MfaVerifyDto === "undefined" ? Object : _mfaverifydto.MfaVerifyDto
    ]),
    _ts_metadata("design:returntype", Promise)
], AuthController.prototype, "mfaVerify", null);
_ts_decorate([
    (0, _common.Post)('mfa/verify-disable'),
    (0, _common.UseGuards)(_jwtauthguard.JwtAuthGuard),
    (0, _swagger.ApiOperation)({
        summary: 'Verify MFA and disable'
    }),
    _ts_param(0, (0, _currentuserdecorator.CurrentUser)('userId')),
    _ts_param(1, (0, _common.Body)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        typeof _mfaverifydto.MfaVerifyDto === "undefined" ? Object : _mfaverifydto.MfaVerifyDto
    ]),
    _ts_metadata("design:returntype", Promise)
], AuthController.prototype, "mfaVerifyAndDisable", null);
_ts_decorate([
    (0, _common.Post)('password-reset/request'),
    (0, _throttler.Throttle)({
        default: {
            limit: 3,
            ttl: 3600000
        }
    }),
    (0, _swagger.ApiOperation)({
        summary: 'Request password reset'
    }),
    _ts_param(0, (0, _common.Body)()),
    _ts_param(1, (0, _common.Req)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _passwordresetdto.PasswordResetRequestDto === "undefined" ? Object : _passwordresetdto.PasswordResetRequestDto,
        typeof _requestwithuserinterface.RequestWithUser === "undefined" ? Object : _requestwithuserinterface.RequestWithUser
    ]),
    _ts_metadata("design:returntype", Promise)
], AuthController.prototype, "passwordResetRequest", null);
_ts_decorate([
    (0, _common.Post)('password-reset/confirm'),
    (0, _swagger.ApiOperation)({
        summary: 'Confirm password reset'
    }),
    _ts_param(0, (0, _common.Body)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _passwordresetdto.PasswordResetConfirmDto === "undefined" ? Object : _passwordresetdto.PasswordResetConfirmDto
    ]),
    _ts_metadata("design:returntype", Promise)
], AuthController.prototype, "passwordResetConfirm", null);
_ts_decorate([
    (0, _common.Get)('sessions'),
    (0, _common.UseGuards)(_jwtauthguard.JwtAuthGuard),
    (0, _swagger.ApiOperation)({
        summary: 'List active sessions'
    }),
    _ts_param(0, (0, _currentuserdecorator.CurrentUser)('userId')),
    _ts_param(1, (0, _currentuserdecorator.CurrentUser)('sessionId')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        String
    ]),
    _ts_metadata("design:returntype", Promise)
], AuthController.prototype, "getSessions", null);
_ts_decorate([
    (0, _common.Delete)('sessions/:sessionId'),
    (0, _common.UseGuards)(_jwtauthguard.JwtAuthGuard),
    (0, _swagger.ApiOperation)({
        summary: 'Revoke a session'
    }),
    _ts_param(0, (0, _currentuserdecorator.CurrentUser)('userId')),
    _ts_param(1, (0, _common.Param)('sessionId')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        String
    ]),
    _ts_metadata("design:returntype", Promise)
], AuthController.prototype, "revokeSession", null);
AuthController = _ts_decorate([
    (0, _swagger.ApiTags)('auth'),
    (0, _common.Controller)('auth'),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _authservice.AuthService === "undefined" ? Object : _authservice.AuthService
    ])
], AuthController);

//# sourceMappingURL=auth.controller.js.map