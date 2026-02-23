"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const throttler_1 = require("@nestjs/throttler");
const swagger_1 = require("@nestjs/swagger");
const auth_service_1 = require("./auth.service");
const login_dto_1 = require("./dto/login.dto");
const refresh_token_dto_1 = require("./dto/refresh-token.dto");
const mfa_verify_dto_1 = require("./dto/mfa-verify.dto");
const mfa_setup_dto_1 = require("./dto/mfa-setup.dto");
const mfa_login_verify_dto_1 = require("./dto/mfa-login-verify.dto");
const password_reset_dto_1 = require("./dto/password-reset.dto");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
const jwt_refresh_guard_1 = require("../../common/guards/jwt-refresh.guard");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
const user_entity_1 = require("../users/entities/user.entity");
let AuthController = class AuthController {
    constructor(authService) {
        this.authService = authService;
    }
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
        return this.authService.mfaSetup(user, dto.accountName);
    }
    async mfaVerify(userId, dto) {
        return this.authService.mfaVerify(userId, dto.code);
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
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.Post)('login'),
    (0, throttler_1.Throttle)({ default: { limit: 5, ttl: 900000 } }),
    (0, swagger_1.ApiOperation)({ summary: 'Login with username and password' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [login_dto_1.LoginDto, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
__decorate([
    (0, common_1.Post)('mfa/verify-login'),
    (0, throttler_1.Throttle)({ default: { limit: 5, ttl: 900000 } }),
    (0, swagger_1.ApiOperation)({ summary: 'Verify MFA code and complete login' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [mfa_login_verify_dto_1.MfaLoginVerifyDto, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "verifyMfaAndLogin", null);
__decorate([
    (0, common_1.Post)('refresh'),
    (0, common_1.UseGuards)(jwt_refresh_guard_1.JwtRefreshGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Refresh access token' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [refresh_token_dto_1.RefreshTokenDto, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "refresh", null);
__decorate([
    (0, common_1.Post)('logout'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Logout' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('userId')),
    __param(1, (0, current_user_decorator_1.CurrentUser)('sessionId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "logout", null);
__decorate([
    (0, common_1.Post)('mfa/setup'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Setup MFA (Google/Microsoft Authenticator)',
        description: 'Requires the **access token** in the Authorization header (Bearer). Use the accessToken from login, or from POST /auth/mfa/verify-login if login returned mfaRequired.',
    }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User, mfa_setup_dto_1.MfaSetupDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "mfaSetup", null);
__decorate([
    (0, common_1.Post)('mfa/verify'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Verify MFA and enable' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('userId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, mfa_verify_dto_1.MfaVerifyDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "mfaVerify", null);
__decorate([
    (0, common_1.Post)('password-reset/request'),
    (0, throttler_1.Throttle)({ default: { limit: 3, ttl: 3600000 } }),
    (0, swagger_1.ApiOperation)({ summary: 'Request password reset' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [password_reset_dto_1.PasswordResetRequestDto, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "passwordResetRequest", null);
__decorate([
    (0, common_1.Post)('password-reset/confirm'),
    (0, swagger_1.ApiOperation)({ summary: 'Confirm password reset' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [password_reset_dto_1.PasswordResetConfirmDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "passwordResetConfirm", null);
__decorate([
    (0, common_1.Get)('sessions'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiOperation)({ summary: 'List active sessions' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('userId')),
    __param(1, (0, current_user_decorator_1.CurrentUser)('sessionId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "getSessions", null);
__decorate([
    (0, common_1.Delete)('sessions/:sessionId'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Revoke a session' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('userId')),
    __param(1, (0, common_1.Param)('sessionId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "revokeSession", null);
exports.AuthController = AuthController = __decorate([
    (0, swagger_1.ApiTags)('auth'),
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map