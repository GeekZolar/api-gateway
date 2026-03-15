"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "InventoryModule", {
    enumerable: true,
    get: function() {
        return InventoryModule;
    }
});
const _common = require("@nestjs/common");
const _typeorm = require("@nestjs/typeorm");
const _authmodule = require("../auth/auth.module");
const _warehouseentity = require("./entities/warehouse.entity");
const _productentity = require("./entities/product.entity");
const _inventoryentity = require("./entities/inventory.entity");
const _inventorytransactionentity = require("./entities/inventory-transaction.entity");
const _transferentity = require("./entities/transfer.entity");
const _transferlineentity = require("./entities/transfer-line.entity");
const _inventoryservice = require("./inventory.service");
const _inventorycontroller = require("./inventory.controller");
const _warehousescontroller = require("./warehouses.controller");
const _productscontroller = require("./products.controller");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let InventoryModule = class InventoryModule {
};
InventoryModule = _ts_decorate([
    (0, _common.Module)({
        imports: [
            _typeorm.TypeOrmModule.forFeature([
                _warehouseentity.Warehouse,
                _productentity.Product,
                _inventoryentity.Inventory,
                _inventorytransactionentity.InventoryTransaction,
                _transferentity.Transfer,
                _transferlineentity.TransferLine
            ]),
            _authmodule.AuthModule
        ],
        controllers: [
            _inventorycontroller.InventoryController,
            _warehousescontroller.WarehousesController,
            _productscontroller.ProductsController
        ],
        providers: [
            _inventoryservice.InventoryService
        ],
        exports: [
            _inventoryservice.InventoryService
        ]
    })
], InventoryModule);

//# sourceMappingURL=inventory.module.js.map