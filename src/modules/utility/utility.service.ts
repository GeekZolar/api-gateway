import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Country } from './entities/country.entity';
import { Category } from './entities/category.entity';
import { Warehouse } from './entities/warehouse.entity';
import { Supplier } from './entities/supplier.entity';
import { Product } from './entities/product.entity';

@Injectable()
export class UtilityService {
  constructor(
    @InjectRepository(Country)
    private readonly countryRepo: Repository<Country>,
    @InjectRepository(Category)
    private readonly categoryRepo: Repository<Category>,
    @InjectRepository(Warehouse)
    private readonly warehouseRepo: Repository<Warehouse>,
    @InjectRepository(Supplier)
    private readonly supplierRepo: Repository<Supplier>,
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
  ) {}

  findCountries(): Promise<Country[]> {
    return this.countryRepo.find({ order: { countryName: 'ASC' } });
  }

  findCategories(): Promise<Category[]> {
    return this.categoryRepo.find({ order: { categoryName: 'ASC' } });
  }

  findWarehouses(): Promise<Warehouse[]> {
    return this.warehouseRepo.find({ order: { name: 'ASC' } });
  }

  findSuppliers(): Promise<Supplier[]> {
    return this.supplierRepo.find({ order: { supplierName: 'ASC' } });
  }

  findProducts(): Promise<Product[]> {
    return this.productRepo.find({ order: { productName: 'ASC' } });
  }
}
