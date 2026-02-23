"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const throttler_1 = require("@nestjs/throttler");
const gateway_config_1 = require("./config/gateway.config");
const proxy_module_1 = require("./proxy/proxy.module");
const health_module_1 = require("./health/health.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                load: [gateway_config_1.default],
                envFilePath: ['.env.local', '.env'],
            }),
            throttler_1.ThrottlerModule.forRootAsync({
                useFactory: (config) => ({
                    throttlers: [
                        { ttl: config.get('throttleTtl', 900000), limit: config.get('throttleLimit', 100) },
                    ],
                }),
                inject: [config_1.ConfigService],
                imports: [config_1.ConfigModule],
            }),
            proxy_module_1.ProxyModule,
            health_module_1.HealthModule,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map