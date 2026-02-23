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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProxyService = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = require("@nestjs/axios");
const config_1 = require("@nestjs/config");
const rxjs_1 = require("rxjs");
const CircuitBreaker = require('opossum');
let ProxyService = class ProxyService {
    constructor(http, config) {
        this.http = http;
        this.config = config;
        this.breakers = new Map();
        this.userServiceUrl = this.config.get('userServiceUrl', 'http://localhost:3001');
        this.timeout = this.config.get('requestTimeout', 30000);
    }
    getBreaker(name) {
        if (!this.breakers.has(name)) {
            const threshold = this.config.get('circuitBreakerThreshold', 5);
            const breaker = new CircuitBreaker(async (url, config) => {
                const res = await (0, rxjs_1.firstValueFrom)(this.http.request({
                    ...config,
                    url,
                    timeout: this.timeout,
                    validateStatus: () => true,
                }));
                if (res.status >= 500)
                    throw new Error(`Upstream ${res.status}`);
                return res;
            }, {
                timeout: this.timeout,
                errorThresholdPercentage: 50,
                volumeThreshold: threshold,
                resetTimeout: 30000,
            });
            breaker.on('open', () => console.warn(`[Gateway] Circuit open: ${name}`));
            breaker.fallback(() => ({
                data: { message: 'Service temporarily unavailable', statusCode: 503 },
                status: 503,
                statusText: 'Service Unavailable',
                headers: {},
                config: {},
            }));
            this.breakers.set(name, breaker);
        }
        return this.breakers.get(name);
    }
    async forward(serviceName, path, method, headers, body, query) {
        const baseUrl = this.userServiceUrl;
        const url = `${baseUrl.replace(/\/$/, '')}${path}${query ? `?${query}` : ''}`;
        const config = {
            method: method,
            headers: this.sanitizeHeaders(headers),
            data: body,
        };
        const breaker = this.getBreaker(serviceName);
        const response = await breaker.fire(url, config);
        return response;
    }
    sanitizeHeaders(headers) {
        const allowed = ['content-type', 'authorization', 'accept', 'x-correlation-id'];
        const out = {};
        for (const [k, v] of Object.entries(headers)) {
            const lower = k.toLowerCase();
            if (allowed.includes(lower) && typeof v === 'string') {
                out[k] = v;
            }
        }
        return out;
    }
    getServiceUrl(service) {
        if (service === 'user-management')
            return this.userServiceUrl;
        return this.userServiceUrl;
    }
};
exports.ProxyService = ProxyService;
exports.ProxyService = ProxyService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [axios_1.HttpService,
        config_1.ConfigService])
], ProxyService);
//# sourceMappingURL=proxy.service.js.map