"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = () => ({
    jwt: {
        accessSecret: process.env.JWT_ACCESS_SECRET || 'change-me-access-secret-min-32-characters-long',
        refreshSecret: process.env.JWT_REFRESH_SECRET || 'change-me-refresh-secret-min-32-characters',
        accessExpiration: process.env.JWT_ACCESS_EXPIRATION || '15m',
        refreshExpiration: process.env.JWT_REFRESH_EXPIRATION || '7d',
    },
});
//# sourceMappingURL=jwt.config.js.map