import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { Country } from './entities/country.entity';
import { Category } from './entities/category.entity';
import { Warehouse } from './entities/warehouse.entity';
import { Supplier } from './entities/supplier.entity';
import { Product } from './entities/product.entity';
import { UtilityController } from './utility.controller';
import { UtilityService } from './utility.service';

@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forFeature([Country, Category, Warehouse, Supplier, Product]),
  ],
  controllers: [UtilityController],
  providers: [UtilityService],
  exports: [UtilityService],
})
export class UtilityModule {}
