"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "ProxyController", {
    enumerable: true,
    get: function() {
        return ProxyController;
    }
});
const _common = require("@nestjs/common");
const _swagger = require("@nestjs/swagger");
const _express = require("express");
const _throttler = require("@nestjs/throttler");
const _proxyservice = require("./proxy.service");
const _jwtauthguard = require("./guards/jwt-auth.guard");
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
function generateCorrelationId() {
    return typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(36) + Math.random().toString(36).slice(2);
}
const USER_SERVICE_PREFIX = '/api/v1';
let ProxyController = class ProxyController {
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
                    passwordReset: 'POST /api/v1/auth/password-reset/request'
                },
                users: 'POST /api/v1/users (register), GET/PATCH /api/v1/users (with auth)',
                roles: 'GET /api/v1/roles, GET /api/v1/roles/registration (public)'
            }
        };
    }
    async proxyLogin(req, res) {
        const correlationId = req.headers['x-correlation-id'] || generateCorrelationId();
        this.logger.log({
            correlationId,
            method: req.method,
            path: req.path
        });
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
        this.logger.log({
            correlationId,
            method: req.method,
            path: req.path
        });
        return this.proxyRequest(req, res, 'user-management', true, correlationId);
    }
    async proxyRequest(req, res, serviceName, authRequired, correlationId) {
        const path = req.path.startsWith(USER_SERVICE_PREFIX) ? req.path : `${USER_SERVICE_PREFIX}${req.path}`;
        const query = req.url.includes('?') ? req.url.split('?')[1] : undefined;
        const headers = {
            ...req.headers
        };
        headers['x-correlation-id'] = correlationId;
        try {
            const response = await this.proxy.forward(serviceName, path, req.method, headers, req.body, query);
            res.status(response.status).set(response.headers).json(response.data);
        } catch (err) {
            this.logger.error({
                correlationId,
                error: err?.message
            });
            res.status(502).json({
                statusCode: 502,
                message: 'Bad Gateway',
                correlationId
            });
        }
    }
    constructor(proxy){
        this.proxy = proxy;
        this.logger = new _common.Logger(ProxyController.name);
    }
};
_ts_decorate([
    (0, _common.Get)(),
    (0, _swagger.ApiOperation)({
        summary: 'Service info and endpoint list'
    }),
    (0, _swagger.ApiResponse)({
        status: 200,
        description: 'Gateway info'
    }),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", []),
    _ts_metadata("design:returntype", void 0)
], ProxyController.prototype, "root", null);
_ts_decorate([
    (0, _common.All)('auth/login'),
    (0, _throttler.Throttle)({
        default: {
            limit: 5,
            ttl: 900000
        }
    }),
    _ts_param(0, (0, _common.Req)()),
    _ts_param(1, (0, _common.Res)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _express.Request === "undefined" ? Object : _express.Request,
        typeof _express.Response === "undefined" ? Object : _express.Response
    ]),
    _ts_metadata("design:returntype", Promise)
], ProxyController.prototype, "proxyLogin", null);
_ts_decorate([
    (0, _common.All)('auth/refresh'),
    _ts_param(0, (0, _common.Req)()),
    _ts_param(1, (0, _common.Res)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _express.Request === "undefined" ? Object : _express.Request,
        typeof _express.Response === "undefined" ? Object : _express.Response
    ]),
    _ts_metadata("design:returntype", Promise)
], ProxyController.prototype, "proxyRefresh", null);
_ts_decorate([
    (0, _common.All)('auth/password-reset/request'),
    (0, _common.All)('auth/password-reset/confirm'),
    _ts_param(0, (0, _common.Req)()),
    _ts_param(1, (0, _common.Res)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _express.Request === "undefined" ? Object : _express.Request,
        typeof _express.Response === "undefined" ? Object : _express.Response
    ]),
    _ts_metadata("design:returntype", Promise)
], ProxyController.prototype, "proxyPasswordReset", null);
_ts_decorate([
    (0, _common.Post)('users'),
    _ts_param(0, (0, _common.Req)()),
    _ts_param(1, (0, _common.Res)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _express.Request === "undefined" ? Object : _express.Request,
        typeof _express.Response === "undefined" ? Object : _express.Response
    ]),
    _ts_metadata("design:returntype", Promise)
], ProxyController.prototype, "proxyUsersRegister", null);
_ts_decorate([
    (0, _common.All)('roles/registration'),
    _ts_param(0, (0, _common.Req)()),
    _ts_param(1, (0, _common.Res)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _express.Request === "undefined" ? Object : _express.Request,
        typeof _express.Response === "undefined" ? Object : _express.Response
    ]),
    _ts_metadata("design:returntype", Promise)
], ProxyController.prototype, "proxyRolesRegistration", null);
_ts_decorate([
    (0, _common.All)('*'),
    (0, _common.UseGuards)(_jwtauthguard.JwtAuthGuard),
    _ts_param(0, (0, _common.Req)()),
    _ts_param(1, (0, _common.Res)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _express.Request === "undefined" ? Object : _express.Request,
        typeof _express.Response === "undefined" ? Object : _express.Response
    ]),
    _ts_metadata("design:returntype", Promise)
], ProxyController.prototype, "proxyAll", null);
ProxyController = _ts_decorate([
    (0, _swagger.ApiTags)('root'),
    (0, _common.Controller)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _proxyservice.ProxyService === "undefined" ? Object : _proxyservice.ProxyService
    ])
], ProxyController);

//# sourceMappingURL=proxy.controller.js.map