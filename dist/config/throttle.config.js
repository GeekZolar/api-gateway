"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = () => ({
    throttle: {
        ttl: parseInt(process.env.THROTTLE_TTL || '900000', 10),
        limit: parseInt(process.env.THROTTLE_LIMIT || '100', 10),
        authTtl: parseInt(process.env.AUTH_THROTTLE_TTL || '900000', 10),
        authLimit: parseInt(process.env.AUTH_THROTTLE_LIMIT || '5', 10),
    },
});
//# sourceMappingURL=throttle.config.js.map