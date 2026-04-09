import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Forecast } from './entities/forecast.entity';
import { Product } from '../inventory/entities/product.entity';
import { ForecastsService } from './forecasts.service';
import { ForecastsController } from './forecasts.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Forecast, Product]),
  ],
  controllers: [ForecastsController],
  providers: [ForecastsService],
  exports: [ForecastsService],
})
export class ForecastsModule {}
