"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UtilityService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const country_entity_1 = require("./entities/country.entity");
const category_entity_1 = require("./entities/category.entity");
const warehouse_entity_1 = require("./entities/warehouse.entity");
const supplier_entity_1 = require("./entities/supplier.entity");
const product_entity_1 = require("./entities/product.entity");
let UtilityService = class UtilityService {
    constructor(countryRepo, categoryRepo, warehouseRepo, supplierRepo, productRepo) {
        this.countryRepo = countryRepo;
        this.categoryRepo = categoryRepo;
        this.warehouseRepo = warehouseRepo;
        this.supplierRepo = supplierRepo;
        this.productRepo = productRepo;
    }
    findCountries() {
        return this.countryRepo.find({ order: { countryName: 'ASC' } });
    }
    findCategories() {
        return this.categoryRepo.find({ order: { categoryName: 'ASC' } });
    }
    findWarehouses() {
        return this.warehouseRepo.find({ order: { name: 'ASC' } });
    }
    findSuppliers() {
        return this.supplierRepo.find({ order: { supplierName: 'ASC' } });
    }
    findProducts() {
        return this.productRepo.find({ order: { productName: 'ASC' } });
    }
};
exports.UtilityService = UtilityService;
exports.UtilityService = UtilityService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(country_entity_1.Country)),
    __param(1, (0, typeorm_1.InjectRepository)(category_entity_1.Category)),
    __param(2, (0, typeorm_1.InjectRepository)(warehouse_entity_1.Warehouse)),
    __param(3, (0, typeorm_1.InjectRepository)(supplier_entity_1.Supplier)),
    __param(4, (0, typeorm_1.InjectRepository)(product_entity_1.Product)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], UtilityService);
//# sourceMappingURL=utility.service.js.map