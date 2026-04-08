import { UtilityService } from './utility.service';
export declare class UtilityController {
    private readonly utilityService;
    constructor(utilityService: UtilityService);
    countries(): Promise<import("./entities/country.entity").Country[]>;
    categories(): Promise<import("./entities/category.entity").Category[]>;
    warehouses(): Promise<import("./entities/warehouse.entity").Warehouse[]>;
    suppliers(): Promise<import("./entities/supplier.entity").Supplier[]>;
    products(): Promise<import("./entities/product.entity").Product[]>;
}
