import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Country } from './entities/country.entity';
import { Category } from './entities/category.entity';
import { Warehouse } from './entities/warehouse.entity';
import { Supplier } from './entities/supplier.entity';
import { Product } from './entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

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

  async createProduct(dto: CreateProductDto): Promise<Product> {
    if (dto.sku) {
      const bySku = await this.productRepo.findOne({ where: { sku: dto.sku } });
      if (bySku) throw new ConflictException(`Product SKU "${dto.sku}" already exists`);
    }

    const p = this.productRepo.create({
      ...(dto.productId ? { productId: dto.productId } : {}),
      supplierId: dto.supplierId ?? null,
      productName: dto.productName,
      description: dto.description ?? null,
      categoryId: dto.categoryId ?? null,
      productSize: dto.productSize ?? null,
      sku: dto.sku ?? null,
      minOrderPallet: dto.minOrderPallet ?? null,
      casePerPallet: dto.casePerPallet ?? null,
      shelfLifeMonth: dto.shelfLifeMonth ?? null,
      isActive: dto.isActive ?? true,
      isSeasonal: dto.isSeasonal ?? false,
      seasonStartDate: dto.seasonStartDate ? new Date(dto.seasonStartDate) : null,
      seasonEndDate: dto.seasonEndDate ? new Date(dto.seasonEndDate) : null,
      countryCode: dto.countryCode ?? null,
      modifiedAt: dto.modifiedAt ? new Date(dto.modifiedAt) : null,
      note: dto.note ?? null,
    });

    return this.productRepo.save(p);
  }

  async updateProduct(productId: string, dto: UpdateProductDto): Promise<Product> {
    const product = await this.productRepo.findOne({ where: { productId } });
    if (!product) throw new NotFoundException(`Product "${productId}" not found`);

    if (dto.sku !== undefined) {
      if (dto.sku) {
        const bySku = await this.productRepo.findOne({ where: { sku: dto.sku } });
        if (bySku && bySku.productId !== productId) {
          throw new ConflictException(`Product SKU "${dto.sku}" already exists`);
        }
      }
      product.sku = dto.sku ?? null;
    }

    if (dto.productName !== undefined) product.productName = dto.productName;
    if (dto.supplierId !== undefined) product.supplierId = dto.supplierId ?? null;
    if (dto.description !== undefined) product.description = dto.description ?? null;
    if (dto.categoryId !== undefined) product.categoryId = dto.categoryId ?? null;
    if (dto.productSize !== undefined) product.productSize = dto.productSize ?? null;
    if (dto.minOrderPallet !== undefined) product.minOrderPallet = dto.minOrderPallet ?? null;
    if (dto.casePerPallet !== undefined) product.casePerPallet = dto.casePerPallet ?? null;
    if (dto.shelfLifeMonth !== undefined) product.shelfLifeMonth = dto.shelfLifeMonth ?? null;
    if (dto.isActive !== undefined) product.isActive = dto.isActive;
    if (dto.isSeasonal !== undefined) product.isSeasonal = dto.isSeasonal;
    if (dto.seasonStartDate !== undefined) {
      product.seasonStartDate = dto.seasonStartDate ? new Date(dto.seasonStartDate) : null;
    }
    if (dto.seasonEndDate !== undefined) {
      product.seasonEndDate = dto.seasonEndDate ? new Date(dto.seasonEndDate) : null;
    }
    if (dto.countryCode !== undefined) product.countryCode = dto.countryCode ?? null;
    if (dto.modifiedAt !== undefined) {
      product.modifiedAt = dto.modifiedAt ? new Date(dto.modifiedAt) : null;
    }
    if (dto.note !== undefined) product.note = dto.note ?? null;

    return this.productRepo.save(product);
  }
}
