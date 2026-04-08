"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "AppModule", {
    enumerable: true,
    get: function() {
        return AppModule;
    }
});
const _common = require("@nestjs/common");
const _config = require("@nestjs/config");
const _typeorm = require("@nestjs/typeorm");
const _throttler = require("@nestjs/throttler");
const _gatewayconfig = /*#__PURE__*/ _interop_require_default(require("./config/gateway.config"));
const _databaseconfig = /*#__PURE__*/ _interop_require_default(require("./config/database.config"));
const _jwtconfig = /*#__PURE__*/ _interop_require_default(require("./config/jwt.config"));
const _proxymodule = require("./proxy/proxy.module");
const _healthmodule = require("./health/health.module");
const _authmodule = require("./auth/auth.module");
const _inventorymodule = require("./inventory/inventory.module");
const _forecastsmodule = require("./forecasts/forecasts.module");
const _purchaseordersmodule = require("./purchase-orders/purchase-orders.module");
const _reportsmodule = require("./reports/reports.module");
const _dashboardmodule = require("./dashboard/dashboard.module");
const _recommendationsmodule = require("./recommendations/recommendations.module");
const _authmodule1 = require("./modules/auth/auth.module");
const _usersmodule = require("./modules/users/users.module");
const _rolesmodule = require("./modules/roles/roles.module");
const _auditmodule = require("./modules/audit/audit.module");
const _utilitymodule = require("./modules/utility/utility.module");
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let AppModule = class AppModule {
};
AppModule = _ts_decorate([
    (0, _common.Module)({
        imports: [
            _config.ConfigModule.forRoot({
                isGlobal: true,
                load: [
                    _gatewayconfig.default,
                    _databaseconfig.default,
                    _jwtconfig.default
                ],
                envFilePath: [
                    '.env.local',
                    '.env'
                ]
            }),
            _typeorm.TypeOrmModule.forRootAsync({
                useFactory: (config)=>({
                        type: 'postgres',
                        host: config.get('database.host'),
                        port: config.get('database.port'),
                        username: config.get('database.username'),
                        password: config.get('database.password'),
                        database: config.get('database.database'),
                        schema: config.get('database.schema', 'public'),
                        ssl: config.get('database.ssl'),
                        synchronize: config.get('database.synchronize'),
                        logging: config.get('database.logging'),
                        entities: [
                            __dirname + '/auth/**/*.entity{.ts,.js}',
                            __dirname + '/users/**/*.entity{.ts,.js}',
                            __dirname + '/inventory/**/*.entity{.ts,.js}',
                            __dirname + '/forecasts/**/*.entity{.ts,.js}',
                            __dirname + '/purchase-orders/**/*.entity{.ts,.js}',
                            __dirname + '/reports/**/*.entity{.ts,.js}',
                            __dirname + '/modules/**/*.entity{.ts,.js}'
                        ],
                        extra: {
                            min: config.get('database.poolMin', 5),
                            max: config.get('database.poolMax', 20)
                        }
                    }),
                inject: [
                    _config.ConfigService
                ],
                imports: [
                    _config.ConfigModule
                ]
            }),
            _throttler.ThrottlerModule.forRootAsync({
                useFactory: (config)=>({
                        throttlers: [
                            {
                                ttl: config.get('throttleTtl', 900000),
                                limit: config.get('throttleLimit', 100)
                            }
                        ]
                    }),
                inject: [
                    _config.ConfigService
                ],
                imports: [
                    _config.ConfigModule
                ]
            }),
            _proxymodule.ProxyModule,
            _healthmodule.HealthModule,
            _authmodule.AuthModule,
            _inventorymodule.InventoryModule,
            _forecastsmodule.ForecastsModule,
            _purchaseordersmodule.PurchaseOrdersModule,
            _reportsmodule.ReportsModule,
            _dashboardmodule.DashboardModule,
            _recommendationsmodule.RecommendationsModule,
            _authmodule1.AuthModule,
            _usersmodule.UsersModule,
            _rolesmodule.RolesModule,
            _auditmodule.AuditModule,
            _utilitymodule.UtilityModule
        ]
    })
], AppModule);

//# sourceMappingURL=app.module.js.map