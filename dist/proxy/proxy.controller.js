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
var ProxyController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProxyController = void 0;
const common_1 = require("@nestjs/common");
const throttler_1 = require("@nestjs/throttler");
const proxy_service_1 = require("./proxy.service");
const jwt_auth_guard_1 = require("./guards/jwt-auth.guard");
function generateCorrelationId() {
    return typeof crypto !== 'undefined' && crypto.randomUUID
        ? crypto.randomUUID()
        : Date.now().toString(36) + Math.random().toString(36).slice(2);
}
const USER_SERVICE_PREFIX = '/api/v1';
let ProxyController = ProxyController_1 = class ProxyController {
    constructor(proxy) {
        this.proxy = proxy;
        this.logger = new common_1.Logger(ProxyController_1.name);
    }
    root() {
        return {
            service: 'API Gateway',
            version: '1.0',
            prefix: '/api/v1',
            endpoints: {
                health: '/api/v1/health',
                auth: {
                    login: 'POST /api/v1/auth/login',
                    refresh: 'POST /api/v1/auth/refresh',
                    logout: 'POST /api/v1/auth/logout',
                    passwordReset: 'POST /api/v1/auth/password-reset/request',
                },
                users: 'POST /api/v1/users (register), GET/PATCH /api/v1/users (with auth)',
                roles: 'GET /api/v1/roles, GET /api/v1/roles/registration (public)',
            },
        };
    }
    async proxyLogin(req, res) {
        const correlationId = req.headers['x-correlation-id'] || generateCorrelationId();
        this.logger.log({ correlationId, method: req.method, path: req.path });
        return this.proxyRequest(req, res, 'user-management', false, correlationId);
    }
    async proxyRefresh(req, res) {
        const correlationId = req.headers['x-correlation-id'] || generateCorrelationId();
        return this.proxyRequest(req, res, 'user-management', false, correlationId);
    }
    async proxyPasswordReset(req, res) {
        const correlationId = req.headers['x-correlation-id'] || generateCorrelationId();
        return this.proxyRequest(req, res, 'user-management', false, correlationId);
    }
    async proxyUsersRegister(req, res) {
        const correlationId = req.headers['x-correlation-id'] || generateCorrelationId();
        return this.proxyRequest(req, res, 'user-management', false, correlationId);
    }
    async proxyRolesRegistration(req, res) {
        const correlationId = req.headers['x-correlation-id'] || generateCorrelationId();
        return this.proxyRequest(req, res, 'user-management', false, correlationId);
    }
    async proxyAll(req, res) {
        const correlationId = req.headers['x-correlation-id'] || generateCorrelationId();
        this.logger.log({ correlationId, method: req.method, path: req.path });
        return this.proxyRequest(req, res, 'user-management', true, correlationId);
    }
    async proxyRequest(req, res, serviceName, authRequired, correlationId) {
        const path = req.path.startsWith(USER_SERVICE_PREFIX) ? req.path : `${USER_SERVICE_PREFIX}${req.path}`;
        const query = req.url.includes('?') ? req.url.split('?')[1] : undefined;
        const headers = { ...req.headers };
        headers['x-correlation-id'] = correlationId;
        try {
            const response = await this.proxy.forward(serviceName, path, req.method, headers, req.body, query);
            res.status(response.status).set(response.headers).json(response.data);
        }
        catch (err) {
            this.logger.error({ correlationId, error: err?.message });
            res.status(502).json({
                statusCode: 502,
                message: 'Bad Gateway',
                correlationId,
            });
        }
    }
};
exports.ProxyController = ProxyController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ProxyController.prototype, "root", null);
__decorate([
    (0, common_1.All)('auth/login'),
    (0, throttler_1.Throttle)({ default: { limit: 5, ttl: 900000 } }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ProxyController.prototype, "proxyLogin", null);
__decorate([
    (0, common_1.All)('auth/refresh'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ProxyController.prototype, "proxyRefresh", null);
__decorate([
    (0, common_1.All)('auth/password-reset/request'),
    (0, common_1.All)('auth/password-reset/confirm'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ProxyController.prototype, "proxyPasswordReset", null);
__decorate([
    (0, common_1.Post)('users'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ProxyController.prototype, "proxyUsersRegister", null);
__decorate([
    (0, common_1.All)('roles/registration'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ProxyController.prototype, "proxyRolesRegistration", null);
__decorate([
    (0, common_1.All)('*'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ProxyController.prototype, "proxyAll", null);
exports.ProxyController = ProxyController = ProxyController_1 = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [proxy_service_1.ProxyService])
], ProxyController);
//# sourceMappingURL=proxy.controller.js.map