"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "ForecastsService", {
    enumerable: true,
    get: function() {
        return ForecastsService;
    }
});
const _common = require("@nestjs/common");
const _typeorm = require("@nestjs/typeorm");
const _typeorm1 = require("typeorm");
const _forecastentity = require("./entities/forecast.entity");
const _productentity = require("../inventory/entities/product.entity");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
function _ts_param(paramIndex, decorator) {
    return function(target, key) {
        decorator(target, key, paramIndex);
    };
}
let ForecastsService = class ForecastsService {
    async getBySku(sku, warehouseId, from, to) {
        const product = await this.productRepo.findOne({
            where: {
                sku
            }
        });
        if (!product) throw new _common.NotFoundException(`Product with SKU ${sku} not found`);
        const qb = this.forecastRepo.createQueryBuilder('f').where('f.product_id = :productId', {
            productId: product.id
        });
        if (warehouseId) qb.andWhere('f.warehouse_id = :warehouseId', {
            warehouseId
        });
        if (from) qb.andWhere('f.period_start >= :from', {
            from
        });
        if (to) qb.andWhere('f.period_end <= :to', {
            to
        });
        qb.orderBy('f.period_start', 'ASC');
        const rows = await qb.getMany();
        const forecasts = rows.map((r)=>({
                id: r.id,
                warehouseId: r.warehouseId,
                periodStart: r.periodStart,
                periodEnd: r.periodEnd,
                forecastQty: Number(r.forecastQty),
                overrideQty: r.overrideQty != null ? Number(r.overrideQty) : null
            }));
        return {
            sku,
            forecasts
        };
    }
    async generate(dto) {
        // Stub: in production would enqueue a job
        const jobId = `forecast-${Date.now()}`;
        return {
            jobId,
            message: `Forecast generation started (warehouseIds: ${dto.warehouseIds?.length ?? 'all'}, skuList: ${dto.skuList?.length ?? 'all'}, horizonDays: ${dto.horizonDays ?? 180})`
        };
    }
    async override(sku, dto) {
        const product = await this.productRepo.findOne({
            where: {
                sku
            }
        });
        if (!product) throw new _common.NotFoundException(`Product with SKU ${sku} not found`);
        const qb = this.forecastRepo.createQueryBuilder('f').where('f.product_id = :productId', {
            productId: product.id
        }).andWhere('f.period_start = :periodStart', {
            periodStart: dto.periodStart
        }).andWhere('f.period_end = :periodEnd', {
            periodEnd: dto.periodEnd
        });
        if (dto.warehouseId) qb.andWhere('f.warehouse_id = :warehouseId', {
            warehouseId: dto.warehouseId
        });
        const forecast = await qb.getOne();
        if (!forecast) {
            if (!dto.warehouseId) throw new _common.NotFoundException('No forecast found for this period; provide warehouseId to create override.');
            const newForecast = this.forecastRepo.create({
                productId: product.id,
                warehouseId: dto.warehouseId,
                periodStart: dto.periodStart,
                periodEnd: dto.periodEnd,
                forecastQty: 0,
                overrideQty: dto.overrideQty
            });
            await this.forecastRepo.save(newForecast);
            return {
                updated: true
            };
        }
        forecast.overrideQty = dto.overrideQty;
        await this.forecastRepo.save(forecast);
        return {
            updated: true
        };
    }
    async getAccuracy(from, to, sku, warehouseId) {
        // Stub: return placeholder metrics; real impl would compare forecast vs actual
        const metrics = [
            {
                sku: sku ?? 'all',
                warehouseId: warehouseId ?? 'all',
                mape: 0.12,
                bias: 0.02,
                count: 0
            }
        ];
        return {
            from,
            to,
            metrics
        };
    }
    constructor(forecastRepo, productRepo){
        this.forecastRepo = forecastRepo;
        this.productRepo = productRepo;
    }
};
ForecastsService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_param(0, (0, _typeorm.InjectRepository)(_forecastentity.Forecast)),
    _ts_param(1, (0, _typeorm.InjectRepository)(_productentity.Product)),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _typeorm1.Repository === "undefined" ? Object : _typeorm1.Repository,
        typeof _typeorm1.Repository === "undefined" ? Object : _typeorm1.Repository
    ])
], ForecastsService);

//# sourceMappingURL=forecasts.service.js.map