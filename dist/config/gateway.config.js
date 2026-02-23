"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = () => ({
    port: parseInt(process.env.PORT || '3000', 10),
    apiPrefix: process.env.API_PREFIX || 'api/v1',
    allowedOrigins: process.env.ALLOWED_ORIGINS || 'http://localhost:3000',
    jwtSecret: process.env.JWT_ACCESS_SECRET || process.env.JWT_PUBLIC_KEY,
    throttleTtl: parseInt(process.env.THROTTLE_TTL || '900000', 10),
    throttleLimit: parseInt(process.env.THROTTLE_LIMIT || '100', 10),
    authThrottleLimit: parseInt(process.env.AUTH_THROTTLE_LIMIT || '5', 10),
    userServiceUrl: process.env.USER_SERVICE_URL || 'http://localhost:3001',
    requestTimeout: parseInt(process.env.REQUEST_TIMEOUT || '30000', 10),
    circuitBreakerThreshold: parseInt(process.env.CIRCUIT_BREAKER_THRESHOLD || '5', 10),
});
//# sourceMappingURL=gateway.config.js.map