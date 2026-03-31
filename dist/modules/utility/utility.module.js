"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UtilityModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const auth_module_1 = require("../auth/auth.module");
const country_entity_1 = require("./entities/country.entity");
const category_entity_1 = require("./entities/category.entity");
const warehouse_entity_1 = require("./entities/warehouse.entity");
const supplier_entity_1 = require("./entities/supplier.entity");
const product_entity_1 = require("./entities/product.entity");
const utility_controller_1 = require("./utility.controller");
const utility_service_1 = require("./utility.service");
let UtilityModule = class UtilityModule {
};
exports.UtilityModule = UtilityModule;
exports.UtilityModule = UtilityModule = __decorate([
    (0, common_1.Module)({
        imports: [
            auth_module_1.AuthModule,
            typeorm_1.TypeOrmModule.forFeature([country_entity_1.Country, category_entity_1.Category, warehouse_entity_1.Warehouse, supplier_entity_1.Supplier, product_entity_1.Product]),
        ],
        controllers: [utility_controller_1.UtilityController],
        providers: [utility_service_1.UtilityService],
        exports: [utility_service_1.UtilityService],
    })
], UtilityModule);
//# sourceMappingURL=utility.module.js.map