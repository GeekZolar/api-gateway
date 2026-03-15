import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { Warehouse } from './entities/warehouse.entity';
import { Product } from './entities/product.entity';
import { Inventory } from './entities/inventory.entity';
import { InventoryTransaction } from './entities/inventory-transaction.entity';
import { Transfer } from './entities/transfer.entity';
import { TransferLine } from './entities/transfer-line.entity';
import { InventoryService } from './inventory.service';
import { InventoryController } from './inventory.controller';
import { WarehousesController } from './warehouses.controller';
import { ProductsController } from './products.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Warehouse,
      Product,
      Inventory,
      InventoryTransaction,
      Transfer,
      TransferLine,
    ]),
    AuthModule,
  ],
  controllers: [InventoryController, WarehousesController, ProductsController],
  providers: [InventoryService],
  exports: [InventoryService],
})
export class InventoryModule {}
