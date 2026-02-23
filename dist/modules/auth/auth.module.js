"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthModule = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const passport_1 = require("@nestjs/passport");
const user_entity_1 = require("../users/entities/user.entity");
const password_history_entity_1 = require("../users/entities/password-history.entity");
const password_reset_token_entity_1 = require("./entities/password-reset-token.entity");
const auth_controller_1 = require("./auth.controller");
const auth_service_1 = require("./auth.service");
const jwt_strategy_1 = require("./strategies/jwt.strategy");
const refresh_token_strategy_1 = require("./strategies/refresh-token.strategy");
const password_service_1 = require("./services/password.service");
const mfa_service_1 = require("./services/mfa.service");
const sessions_module_1 = require("../sessions/sessions.module");
const audit_module_1 = require("../audit/audit.module");
let AuthModule = class AuthModule {
};
exports.AuthModule = AuthModule;
exports.AuthModule = AuthModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([user_entity_1.User, password_history_entity_1.PasswordHistory, password_reset_token_entity_1.PasswordResetToken]),
            passport_1.PassportModule.register({ defaultStrategy: 'jwt' }),
            jwt_1.JwtModule.registerAsync({
                imports: [config_1.ConfigModule],
                useFactory: (config) => ({
                    secret: config.get('jwt.accessSecret'),
                    signOptions: { expiresIn: config.get('jwt.accessExpiration', '15m') },
                }),
                inject: [config_1.ConfigService],
            }),
            sessions_module_1.SessionsModule,
            audit_module_1.AuditModule,
        ],
        controllers: [auth_controller_1.AuthController],
        providers: [auth_service_1.AuthService, jwt_strategy_1.JwtStrategy, refresh_token_strategy_1.RefreshTokenStrategy, password_service_1.PasswordService, mfa_service_1.MfaService],
        exports: [auth_service_1.AuthService, password_service_1.PasswordService, jwt_1.JwtModule],
    })
], AuthModule);
//# sourceMappingURL=auth.module.js.map