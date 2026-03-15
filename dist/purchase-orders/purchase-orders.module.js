"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "PurchaseOrdersModule", {
    enumerable: true,
    get: function() {
        return PurchaseOrdersModule;
    }
});
const _common = require("@nestjs/common");
const _typeorm = require("@nestjs/typeorm");
const _purchaseorderentity = require("./entities/purchase-order.entity");
const _purchaseorderlineentity = require("./entities/purchase-order-line.entity");
const _supplierentity = require("./entities/supplier.entity");
const _productentity = require("../inventory/entities/product.entity");
const _warehouseentity = require("../inventory/entities/warehouse.entity");
const _purchaseordersservice = require("./purchase-orders.service");
const _purchaseorderscontroller = require("./purchase-orders.controller");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let PurchaseOrdersModule = class PurchaseOrdersModule {
};
PurchaseOrdersModule = _ts_decorate([
    (0, _common.Module)({
        imports: [
            _typeorm.TypeOrmModule.forFeature([
                _purchaseorderentity.PurchaseOrder,
                _purchaseorderlineentity.PurchaseOrderLine,
                _supplierentity.Supplier,
                _productentity.Product,
                _warehouseentity.Warehouse
            ])
        ],
        controllers: [
            _purchaseorderscontroller.PurchaseOrdersController
        ],
        providers: [
            _purchaseordersservice.PurchaseOrdersService
        ],
        exports: [
            _purchaseordersservice.PurchaseOrdersService
        ]
    })
], PurchaseOrdersModule);

//# sourceMappingURL=purchase-orders.module.js.map