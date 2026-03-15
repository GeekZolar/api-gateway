"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "ProxyService", {
    enumerable: true,
    get: function() {
        return ProxyService;
    }
});
const _common = require("@nestjs/common");
const _axios = require("@nestjs/axios");
const _config = require("@nestjs/config");
const _rxjs = require("rxjs");
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
// eslint-disable-next-line @typescript-eslint/no-var-requires
const CircuitBreaker = require('opossum');
let ProxyService = class ProxyService {
    getBreaker(name) {
        if (!this.breakers.has(name)) {
            const threshold = this.config.get('circuitBreakerThreshold', 5);
            const breaker = new CircuitBreaker(async (url, config)=>{
                const res = await (0, _rxjs.firstValueFrom)(this.http.request({
                    ...config,
                    url,
                    timeout: this.timeout,
                    validateStatus: ()=>true
                }));
                if (res.status >= 500) throw new Error(`Upstream ${res.status}`);
                return res;
            }, {
                timeout: this.timeout,
                errorThresholdPercentage: 50,
                volumeThreshold: threshold,
                resetTimeout: 30000
            });
            breaker.on('open', ()=>console.warn(`[Gateway] Circuit open: ${name}`));
            breaker.fallback(()=>({
                    data: {
                        message: 'Service temporarily unavailable',
                        statusCode: 503
                    },
                    status: 503,
                    statusText: 'Service Unavailable',
                    headers: {},
                    config: {}
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
            data: body
        };
        const breaker = this.getBreaker(serviceName);
        const response = await breaker.fire(url, config);
        return response;
    }
    sanitizeHeaders(headers) {
        const allowed = [
            'content-type',
            'authorization',
            'accept',
            'x-correlation-id'
        ];
        const out = {};
        for (const [k, v] of Object.entries(headers)){
            const lower = k.toLowerCase();
            if (allowed.includes(lower) && typeof v === 'string') {
                out[k] = v;
            }
        }
        return out;
    }
    getServiceUrl(service) {
        if (service === 'user-management') return this.userServiceUrl;
        return this.userServiceUrl;
    }
    constructor(http, config){
        this.http = http;
        this.config = config;
        this.breakers = new Map();
        this.userServiceUrl = this.config.get('userServiceUrl', 'http://localhost:3001');
        this.timeout = this.config.get('requestTimeout', 30000);
    }
};
ProxyService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_param(0, (0, _common.Inject)(_axios.HttpService)),
    _ts_param(1, (0, _common.Inject)(_config.ConfigService)),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _axios.HttpService === "undefined" ? Object : _axios.HttpService,
        typeof _config.ConfigService === "undefined" ? Object : _config.ConfigService
    ])
], ProxyService);

//# sourceMappingURL=proxy.service.js.map