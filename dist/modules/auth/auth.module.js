"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "AuthModule", {
    enumerable: true,
    get: function() {
        return AuthModule;
    }
});
const _common = require("@nestjs/common");
const _jwt = require("@nestjs/jwt");
const _config = require("@nestjs/config");
const _typeorm = require("@nestjs/typeorm");
const _passport = require("@nestjs/passport");
const _userentity = require("../users/entities/user.entity");
const _passwordhistoryentity = require("../users/entities/password-history.entity");
const _passwordresettokenentity = require("./entities/password-reset-token.entity");
const _authcontroller = require("./auth.controller");
const _authservice = require("./auth.service");
const _jwtstrategy = require("./strategies/jwt.strategy");
const _refreshtokenstrategy = require("./strategies/refresh-token.strategy");
const _passwordservice = require("./services/password.service");
const _mfaservice = require("./services/mfa.service");
const _sessionsmodule = require("../sessions/sessions.module");
const _auditmodule = require("../audit/audit.module");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let AuthModule = class AuthModule {
};
AuthModule = _ts_decorate([
    (0, _common.Global)(),
    (0, _common.Module)({
        imports: [
            _typeorm.TypeOrmModule.forFeature([
                _userentity.User,
                _passwordhistoryentity.PasswordHistory,
                _passwordresettokenentity.PasswordResetToken
            ]),
            _passport.PassportModule.register({
                defaultStrategy: 'jwt'
            }),
            _jwt.JwtModule.registerAsync({
                imports: [
                    _config.ConfigModule
                ],
                useFactory: (config)=>({
                        secret: config.get('jwt.accessSecret'),
                        signOptions: {
                            expiresIn: config.get('jwt.accessExpiration', '15m')
                        }
                    }),
                inject: [
                    _config.ConfigService
                ]
            }),
            _sessionsmodule.SessionsModule,
            _auditmodule.AuditModule
        ],
        controllers: [
            _authcontroller.AuthController
        ],
        providers: [
            _authservice.AuthService,
            _jwtstrategy.JwtStrategy,
            _refreshtokenstrategy.RefreshTokenStrategy,
            _passwordservice.PasswordService,
            _mfaservice.MfaService
        ],
        exports: [
            _authservice.AuthService,
            _passwordservice.PasswordService,
            _jwt.JwtModule,
            _passport.PassportModule
        ]
    })
], AuthModule);

//# sourceMappingURL=auth.module.js.map