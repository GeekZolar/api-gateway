"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "ForecastsModule", {
    enumerable: true,
    get: function() {
        return ForecastsModule;
    }
});
const _common = require("@nestjs/common");
const _typeorm = require("@nestjs/typeorm");
const _forecastentity = require("./entities/forecast.entity");
const _productentity = require("../inventory/entities/product.entity");
const _forecastsservice = require("./forecasts.service");
const _forecastscontroller = require("./forecasts.controller");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let ForecastsModule = class ForecastsModule {
};
ForecastsModule = _ts_decorate([
    (0, _common.Module)({
        imports: [
            _typeorm.TypeOrmModule.forFeature([
                _forecastentity.Forecast,
                _productentity.Product
            ])
        ],
        controllers: [
            _forecastscontroller.ForecastsController
        ],
        providers: [
            _forecastsservice.ForecastsService
        ],
        exports: [
            _forecastsservice.ForecastsService
        ]
    })
], ForecastsModule);

//# sourceMappingURL=forecasts.module.js.map