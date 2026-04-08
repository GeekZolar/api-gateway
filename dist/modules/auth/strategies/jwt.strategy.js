"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "JwtStrategy", {
    enumerable: true,
    get: function() {
        return JwtStrategy;
    }
});
const _common = require("@nestjs/common");
const _passport = require("@nestjs/passport");
const _passportjwt = require("passport-jwt");
const _config = require("@nestjs/config");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let JwtStrategy = class JwtStrategy extends (0, _passport.PassportStrategy)(_passportjwt.Strategy, 'jwt') {
    validate(payload) {
        if (payload.type === 'mfa-verification') {
            throw new _common.UnauthorizedException('This endpoint requires an access token. Complete MFA verification first: POST /auth/mfa/verify-login with mfaToken and mfaCode to get an access token.');
        }
        const sessionId = payload.sessionId ?? payload.session_id;
        const sub = payload.sub !== undefined && payload.sub !== null ? String(payload.sub) : undefined;
        if (!sub || !sessionId) {
            throw new _common.UnauthorizedException('Invalid or expired token');
        }
        return {
            userId: sub,
            username: payload.username,
            email: payload.email,
            role: payload.role,
            permissions: payload.permissions || {},
            sessionId
        };
    }
    constructor(config){
        super({
            jwtFromRequest: _passportjwt.ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: config.get('jwt.accessSecret') || process.env.JWT_ACCESS_SECRET
        });
    }
};
JwtStrategy = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _config.ConfigService === "undefined" ? Object : _config.ConfigService
    ])
], JwtStrategy);

//# sourceMappingURL=jwt.strategy.js.map