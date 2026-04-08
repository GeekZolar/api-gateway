"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "UtilityService", {
    enumerable: true,
    get: function() {
        return UtilityService;
    }
});
const _common = require("@nestjs/common");
const _typeorm = require("@nestjs/typeorm");
const _typeorm1 = require("typeorm");
const _countryentity = require("./entities/country.entity");
const _categoryentity = require("./entities/category.entity");
const _warehouseentity = require("./entities/warehouse.entity");
const _supplierentity = require("./entities/supplier.entity");
const _productentity = require("./entities/product.entity");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
function _ts_param(paramIndex, decorator) {
    return function(target, key) {
        decorator(target, key, paramIndex);
    };
}
let UtilityService = class UtilityService {
    findCountries() {
        return this.countryRepo.find({
            order: {
                countryName: 'ASC'
            }
        });
    }
    findCategories() {
        return this.categoryRepo.find({
            order: {
                categoryName: 'ASC'
            }
        });
    }
    findWarehouses() {
        return this.warehouseRepo.find({
            order: {
                name: 'ASC'
            }
        });
    }
    findSuppliers() {
        return this.supplierRepo.find({
            order: {
                supplierName: 'ASC'
            }
        });
    }
    findProducts() {
        return this.productRepo.find({
            order: {
                productName: 'ASC'
            }
        });
    }
    constructor(countryRepo, categoryRepo, warehouseRepo, supplierRepo, productRepo){
        this.countryRepo = countryRepo;
        this.categoryRepo = categoryRepo;
        this.warehouseRepo = warehouseRepo;
        this.supplierRepo = supplierRepo;
        this.productRepo = productRepo;
    }
};
UtilityService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_param(0, (0, _typeorm.InjectRepository)(_countryentity.Country)),
    _ts_param(1, (0, _typeorm.InjectRepository)(_categoryentity.Category)),
    _ts_param(2, (0, _typeorm.InjectRepository)(_warehouseentity.Warehouse)),
    _ts_param(3, (0, _typeorm.InjectRepository)(_supplierentity.Supplier)),
    _ts_param(4, (0, _typeorm.InjectRepository)(_productentity.Product)),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _typeorm1.Repository === "undefined" ? Object : _typeorm1.Repository,
        typeof _typeorm1.Repository === "undefined" ? Object : _typeorm1.Repository,
        typeof _typeorm1.Repository === "undefined" ? Object : _typeorm1.Repository,
        typeof _typeorm1.Repository === "undefined" ? Object : _typeorm1.Repository,
        typeof _typeorm1.Repository === "undefined" ? Object : _typeorm1.Repository
    ])
], UtilityService);

//# sourceMappingURL=utility.service.js.map