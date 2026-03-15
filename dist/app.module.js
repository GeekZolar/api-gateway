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
const _usersmodule = require("./users/users.module");
const _authmodule = require("./auth/auth.module");
const _rolesmodule = require("./roles/roles.module");
const _inventorymodule = require("./inventory/inventory.module");
const _forecastsmodule = require("./forecasts/forecasts.module");
const _purchaseordersmodule = require("./purchase-orders/purchase-orders.module");
const _recommendationsmodule = require("./recommendations/recommendations.module");
const _reportsmodule = require("./reports/reports.module");
const _dashboardmodule = require("./dashboard/dashboard.module");
const _proxymodule = require("./proxy/proxy.module");
const _healthmodule = require("./health/health.module");
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
                    _gatewayconfig.default
                ],
                envFilePath: [
                    '.env.local',
                    '.env'
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
            _typeorm.TypeOrmModule.forRootAsync({
                useFactory: (config)=>({
                        type: 'postgres',
                        url: config.get('databaseUrl'),
                        autoLoadEntities: true,
                        synchronize: process.env.NODE_ENV === 'production' ? false : process.env.SYNC_DB === 'true',
                        logging: process.env.DB_LOGGING === 'true' ? true : [
                            'error'
                        ],
                        // Fail fast if DB unreachable (e.g. Postgres not running) instead of hanging
                        connectTimeoutMS: 10000,
                        extra: {
                            connectionTimeoutMillis: 10000
                        }
                    }),
                inject: [
                    _config.ConfigService
                ],
                imports: [
                    _config.ConfigModule
                ]
            }),
            _usersmodule.UsersModule,
            _authmodule.AuthModule,
            _rolesmodule.RolesModule,
            _inventorymodule.InventoryModule,
            _forecastsmodule.ForecastsModule,
            _purchaseordersmodule.PurchaseOrdersModule,
            _recommendationsmodule.RecommendationsModule,
            _reportsmodule.ReportsModule,
            _dashboardmodule.DashboardModule,
            _proxymodule.ProxyModule,
            _healthmodule.HealthModule
        ]
    })
], AppModule);

//# sourceMappingURL=app.module.js.map