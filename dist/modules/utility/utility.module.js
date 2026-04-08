"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "UtilityModule", {
    enumerable: true,
    get: function() {
        return UtilityModule;
    }
});
const _common = require("@nestjs/common");
const _typeorm = require("@nestjs/typeorm");
const _authmodule = require("../auth/auth.module");
const _countryentity = require("./entities/country.entity");
const _categoryentity = require("./entities/category.entity");
const _warehouseentity = require("./entities/warehouse.entity");
const _supplierentity = require("./entities/supplier.entity");
const _productentity = require("./entities/product.entity");
const _utilitycontroller = require("./utility.controller");
const _utilityservice = require("./utility.service");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let UtilityModule = class UtilityModule {
};
UtilityModule = _ts_decorate([
    (0, _common.Module)({
        imports: [
            _authmodule.AuthModule,
            _typeorm.TypeOrmModule.forFeature([
                _countryentity.Country,
                _categoryentity.Category,
                _warehouseentity.Warehouse,
                _supplierentity.Supplier,
                _productentity.Product
            ])
        ],
        controllers: [
            _utilitycontroller.UtilityController
        ],
        providers: [
            _utilityservice.UtilityService
        ],
        exports: [
            _utilityservice.UtilityService
        ]
    })
], UtilityModule);

//# sourceMappingURL=utility.module.js.map