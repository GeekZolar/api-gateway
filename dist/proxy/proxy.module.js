"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "ProxyModule", {
    enumerable: true,
    get: function() {
        return ProxyModule;
    }
});
const _common = require("@nestjs/common");
const _passport = require("@nestjs/passport");
const _axios = require("@nestjs/axios");
const _jwt = require("@nestjs/jwt");
const _proxycontroller = require("./proxy.controller");
const _proxyservice = require("./proxy.service");
const _jwtstrategy = require("./strategies/jwt.strategy");
const _config = require("@nestjs/config");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let ProxyModule = class ProxyModule {
};
ProxyModule = _ts_decorate([
    (0, _common.Module)({
        imports: [
            _passport.PassportModule.register({
                defaultStrategy: 'jwt'
            }),
            _axios.HttpModule.registerAsync({
                useFactory: (config)=>({
                        timeout: config.get('requestTimeout', 30000),
                        maxRedirects: 0
                    }),
                inject: [
                    _config.ConfigService
                ],
                imports: [
                    _config.ConfigModule
                ]
            }),
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
            _proxycontroller.ProxyController
        ],
        providers: [
            _proxyservice.ProxyService,
            _jwtstrategy.JwtStrategy
        ]
    })
], ProxyModule);

//# sourceMappingURL=proxy.module.js.map