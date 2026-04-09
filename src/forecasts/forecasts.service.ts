import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Forecast } from './entities/forecast.entity';
import { Product } from '../inventory/entities/product.entity';
import { OverrideForecastDto } from './dto/override-forecast.dto';
import { GenerateForecastsDto } from './dto/generate-forecasts.dto';

@Injectable()
export class ForecastsService {
  constructor(
    @InjectRepository(Forecast)
    private readonly forecastRepo: Repository<Forecast>,
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
  ) {}

  async getBySku(
    sku: string,
    warehouseId?: string,
    from?: string,
    to?: string,
  ): Promise<{ sku: string; forecasts: Array<Record<string, unknown>> }> {
    const product = await this.productRepo.findOne({ where: { sku } });
    if (!product) throw new NotFoundException(`Product with SKU ${sku} not found`);

    const qb = this.forecastRepo
      .createQueryBuilder('f')
      .where('f.product_id = :productId', { productId: product.id });
    if (warehouseId) qb.andWhere('f.warehouse_id = :warehouseId', { warehouseId });
    if (from) qb.andWhere('f.period_start >= :from', { from });
    if (to) qb.andWhere('f.period_end <= :to', { to });
    qb.orderBy('f.period_start', 'ASC');

    const rows = await qb.getMany();
    const forecasts = rows.map((r) => ({
      id: r.id,
      warehouseId: r.warehouseId,
      periodStart: r.periodStart,
      periodEnd: r.periodEnd,
      forecastQty: Number(r.forecastQty),
      overrideQty: r.overrideQty != null ? Number(r.overrideQty) : null,
    }));
    return { sku, forecasts };
  }

  async generate(dto: GenerateForecastsDto): Promise<{ jobId: string; message: string }> {
    // Stub: in production would enqueue a job
    const jobId = `forecast-${Date.now()}`;
    return {
      jobId,
      message: `Forecast generation started (warehouseIds: ${dto.warehouseIds?.length ?? 'all'}, skuList: ${dto.skuList?.length ?? 'all'}, horizonDays: ${dto.horizonDays ?? 180})`,
    };
  }

  async override(sku: string, dto: OverrideForecastDto): Promise<{ updated: boolean }> {
    const product = await this.productRepo.findOne({ where: { sku } });
    if (!product) throw new NotFoundException(`Product with SKU ${sku} not found`);

    const qb = this.forecastRepo
      .createQueryBuilder('f')
      .where('f.product_id = :productId', { productId: product.id })
      .andWhere('f.period_start = :periodStart', { periodStart: dto.periodStart })
      .andWhere('f.period_end = :periodEnd', { periodEnd: dto.periodEnd });
    if (dto.warehouseId) qb.andWhere('f.warehouse_id = :warehouseId', { warehouseId: dto.warehouseId });

    const forecast = await qb.getOne();
    if (!forecast) {
      if (!dto.warehouseId) throw new NotFoundException('No forecast found for this period; provide warehouseId to create override.');
      const newForecast = this.forecastRepo.create({
        productId: product.id,
        warehouseId: dto.warehouseId,
        periodStart: dto.periodStart,
        periodEnd: dto.periodEnd,
        forecastQty: 0,
        overrideQty: dto.overrideQty,
      });
      await this.forecastRepo.save(newForecast);
      return { updated: true };
    }
    forecast.overrideQty = dto.overrideQty;
    await this.forecastRepo.save(forecast);
    return { updated: true };
  }

  async getAccuracy(
    from: string,
    to: string,
    sku?: string,
    warehouseId?: string,
  ): Promise<{ from: string; to: string; metrics: Array<Record<string, unknown>> }> {
    // Stub: return placeholder metrics; real impl would compare forecast vs actual
    const metrics = [
      { sku: sku ?? 'all', warehouseId: warehouseId ?? 'all', mape: 0.12, bias: 0.02, count: 0 },
    ];
    return { from, to, metrics };
  }
}
