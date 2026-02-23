"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProxyModule = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const axios_1 = require("@nestjs/axios");
const jwt_1 = require("@nestjs/jwt");
const proxy_controller_1 = require("./proxy.controller");
const proxy_service_1 = require("./proxy.service");
const jwt_strategy_1 = require("./strategies/jwt.strategy");
const config_1 = require("@nestjs/config");
let ProxyModule = class ProxyModule {
};
exports.ProxyModule = ProxyModule;
exports.ProxyModule = ProxyModule = __decorate([
    (0, common_1.Module)({
        imports: [
            passport_1.PassportModule.register({ defaultStrategy: 'jwt' }),
            axios_1.HttpModule.registerAsync({
                useFactory: (config) => ({
                    timeout: config.get('requestTimeout', 30000),
                    maxRedirects: 0,
                }),
                inject: [config_1.ConfigService],
                imports: [config_1.ConfigModule],
            }),
            jwt_1.JwtModule.registerAsync({
                useFactory: (config) => ({
                    secret: config.get('jwtSecret'),
                    signOptions: { expiresIn: '15m' },
                }),
                inject: [config_1.ConfigService],
                imports: [config_1.ConfigModule],
            }),
        ],
        controllers: [proxy_controller_1.ProxyController],
        providers: [proxy_service_1.ProxyService, jwt_strategy_1.JwtStrategy],
    })
], ProxyModule);
//# sourceMappingURL=proxy.module.js.map