import { Repository } from 'typeorm';
import { Country } from './entities/country.entity';
import { Category } from './entities/category.entity';
import { Warehouse } from './entities/warehouse.entity';
import { Supplier } from './entities/supplier.entity';
import { Product } from './entities/product.entity';
export declare class UtilityService {
    private readonly countryRepo;
    private readonly categoryRepo;
    private readonly warehouseRepo;
    private readonly supplierRepo;
    private readonly productRepo;
    constructor(countryRepo: Repository<Country>, categoryRepo: Repository<Category>, warehouseRepo: Repository<Warehouse>, supplierRepo: Repository<Supplier>, productRepo: Repository<Product>);
    findCountries(): Promise<Country[]>;
    findCategories(): Promise<Category[]>;
    findWarehouses(): Promise<Warehouse[]>;
    findSuppliers(): Promise<Supplier[]>;
    findProducts(): Promise<Product[]>;
}
