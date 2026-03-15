import { Module } from '@nestjs/common';
import { PurchaseOrdersModule } from '../purchase-orders/purchase-orders.module';
import { RecommendationsController } from './recommendations.controller';

@Module({
  imports: [PurchaseOrdersModule],
  controllers: [RecommendationsController],
})
export class RecommendationsModule {}
