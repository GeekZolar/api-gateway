"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "AuthService", {
    enumerable: true,
    get: function() {
        return AuthService;
    }
});
const _common = require("@nestjs/common");
const _jwt = require("@nestjs/jwt");
const _typeorm = require("@nestjs/typeorm");
const _typeorm1 = require("typeorm");
const _bcrypt = /*#__PURE__*/ _interop_require_wildcard(require("bcrypt"));
const _crypto = /*#__PURE__*/ _interop_require_wildcard(require("crypto"));
const _usersservice = require("../users/users.service");
const _passwordresettokenentity = require("./entities/password-reset-token.entity");
function _getRequireWildcardCache(nodeInterop) {
    if (typeof WeakMap !== "function") return null;
    var cacheBabelInterop = new WeakMap();
    var cacheNodeInterop = new WeakMap();
    return (_getRequireWildcardCache = function(nodeInterop) {
        return nodeInterop ? cacheNodeInterop : cacheBabelInterop;
    })(nodeInterop);
}
function _interop_require_wildcard(obj, nodeInterop) {
    if (!nodeInterop && obj && obj.__esModule) {
        return obj;
    }
    if (obj === null || typeof obj !== "object" && typeof obj !== "function") {
        return {
            default: obj
        };
    }
    var cache = _getRequireWildcardCache(nodeInterop);
    if (cache && cache.has(obj)) {
        return cache.get(obj);
    }
    var newObj = {
        __proto__: null
    };
    var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;
    for(var key in obj){
        if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) {
            var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;
            if (desc && (desc.get || desc.set)) {
                Object.defineProperty(newObj, key, desc);
            } else {
                newObj[key] = obj[key];
            }
        }
    }
    newObj.default = obj;
    if (cache) {
        cache.set(obj, newObj);
    }
    return newObj;
}
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
const REFRESH_EXPIRY = '7d';
let AuthService = class AuthService {
    async login(dto) {
        const user = await this.usersService.findByUsername(dto.username);
        if (!user) {
            throw new _common.UnauthorizedException('Invalid username or password');
        }
        const match = await _bcrypt.compare(dto.password, user.passwordHash);
        if (!match) {
            throw new _common.UnauthorizedException('Invalid username or password');
        }
        const payload = {
            sub: user.id,
            username: user.username,
            email: user.email,
            role: user.role,
            permissions: {},
            sessionId: user.id
        };
        const accessToken = this.jwtService.sign(payload, {
            expiresIn: '15m'
        });
        const refreshToken = this.jwtService.sign({
            ...payload,
            type: 'refresh'
        }, {
            expiresIn: REFRESH_EXPIRY
        });
        return {
            accessToken,
            refreshToken
        };
    }
    async refresh(dto) {
        try {
            const payload = this.jwtService.verify(dto.refreshToken);
            if (payload.type !== 'refresh') {
                throw new _common.UnauthorizedException('Invalid refresh token');
            }
            const user = await this.usersService.findById(payload.sub);
            if (!user) {
                throw new _common.UnauthorizedException('User no longer exists');
            }
            const newPayload = {
                sub: user.id,
                username: user.username,
                email: user.email,
                role: user.role,
                permissions: {},
                sessionId: user.id
            };
            const accessToken = this.jwtService.sign(newPayload, {
                expiresIn: '15m'
            });
            return {
                accessToken
            };
        } catch  {
            throw new _common.UnauthorizedException('Invalid or expired refresh token');
        }
    }
    async logout() {
        return {
            message: 'Logged out'
        };
    }
    async passwordResetRequest(dto) {
        const user = await this.usersService.findByEmail(dto.email);
        if (!user) {
            return {
                message: 'If that email is registered, a reset link has been sent.'
            };
        }
        await this.resetTokenRepo.delete({
            userId: user.id
        });
        const token = _crypto.randomBytes(32).toString('hex');
        const expiresAt = new Date(Date.now() + 60 * 60 * 1000);
        await this.resetTokenRepo.save(this.resetTokenRepo.create({
            userId: user.id,
            token,
            expiresAt
        }));
        return {
            message: 'If that email is registered, a reset link has been sent.',
            token: process.env.NODE_ENV !== 'production' ? token : undefined
        };
    }
    async passwordResetConfirm(dto) {
        const record = await this.resetTokenRepo.findOne({
            where: {
                token: dto.token
            },
            relations: [
                'user'
            ]
        });
        if (!record || record.expiresAt < new Date()) {
            throw new _common.BadRequestException('Invalid or expired reset token');
        }
        const passwordHash = await _bcrypt.hash(dto.newPassword, 10);
        await this.usersService.updatePassword(record.userId, passwordHash);
        await this.resetTokenRepo.remove(record);
        return {
            message: 'Password has been reset'
        };
    }
    constructor(usersService, jwtService, resetTokenRepo){
        this.usersService = usersService;
        this.jwtService = jwtService;
        this.resetTokenRepo = resetTokenRepo;
    }
};
AuthService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_param(0, (0, _common.Inject)(_usersservice.UsersService)),
    _ts_param(1, (0, _common.Inject)(_jwt.JwtService)),
    _ts_param(2, (0, _typeorm.InjectRepository)(_passwordresettokenentity.PasswordResetToken)),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _usersservice.UsersService === "undefined" ? Object : _usersservice.UsersService,
        typeof _jwt.JwtService === "undefined" ? Object : _jwt.JwtService,
        typeof _typeorm1.Repository === "undefined" ? Object : _typeorm1.Repository
    ])
], AuthService);

//# sourceMappingURL=auth.service.js.map