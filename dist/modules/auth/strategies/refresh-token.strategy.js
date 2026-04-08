"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "RefreshTokenStrategy", {
    enumerable: true,
    get: function() {
        return RefreshTokenStrategy;
    }
});
const _common = require("@nestjs/common");
const _passport = require("@nestjs/passport");
const _passportjwt = require("passport-jwt");
const _config = require("@nestjs/config");
const _authservice = require("../auth.service");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let RefreshTokenStrategy = class RefreshTokenStrategy extends (0, _passport.PassportStrategy)(_passportjwt.Strategy, 'jwt-refresh') {
    async validate(req, payload) {
        const refreshToken = req.body?.refreshToken;
        if (!refreshToken) throw new _common.UnauthorizedException('Refresh token required');
        const user = await this.authService.validateRefreshToken(payload.sessionId, refreshToken);
        if (!user) throw new _common.UnauthorizedException('Invalid or expired refresh token');
        return user;
    }
    constructor(config, authService){
        super({
            jwtFromRequest: _passportjwt.ExtractJwt.fromBodyField('refreshToken'),
            ignoreExpiration: false,
            secretOrKey: config.get('jwt.refreshSecret') || process.env.JWT_REFRESH_SECRET,
            passReqToCallback: true
        }), this.config = config, this.authService = authService;
    }
};
RefreshTokenStrategy = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _config.ConfigService === "undefined" ? Object : _config.ConfigService,
        typeof _authservice.AuthService === "undefined" ? Object : _authservice.AuthService
    ])
], RefreshTokenStrategy);

//# sourceMappingURL=refresh-token.strategy.js.map