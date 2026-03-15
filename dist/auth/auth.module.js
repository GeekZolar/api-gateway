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
const _config = require("@nestjs/config");
const _typeorm = require("@nestjs/typeorm");
const _jwt = require("@nestjs/jwt");
const _usersmodule = require("../users/users.module");
const _passwordresettokenentity = require("./entities/password-reset-token.entity");
const _authservice = require("./auth.service");
const _authcontroller = require("./auth.controller");
const _rolesguard = require("./roles.guard");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let AuthModule = class AuthModule {
};
AuthModule = _ts_decorate([
    (0, _common.Module)({
        imports: [
            (0, _common.forwardRef)(()=>_usersmodule.UsersModule),
            _typeorm.TypeOrmModule.forFeature([
                _passwordresettokenentity.PasswordResetToken
            ]),
            _jwt.JwtModule.registerAsync({
                useFactory: (config)=>({
                        secret: config.get('jwtSecret'),
                        signOptions: {
                            expiresIn: '15m'
                        }
                    }),
                inject: [
                    _config.ConfigService
                ],
                imports: [
                    _config.ConfigModule
                ]
            })
        ],
        controllers: [
            _authcontroller.AuthController
        ],
        providers: [
            _authservice.AuthService,
            _rolesguard.RolesGuard
        ],
        exports: [
            _rolesguard.RolesGuard
        ]
    })
], AuthModule);

//# sourceMappingURL=auth.module.js.map