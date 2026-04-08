import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThrottlerModule } from '@nestjs/throttler';
import gatewayConfig from './config/gateway.config';
import { ProxyModule } from './proxy/proxy.module';
import { HealthModule } from './health/health.module';
import { AuthModule } from './auth/auth.module';
import { InventoryModule } from './inventory/inventory.module';
import { ForecastsModule } from './forecasts/forecasts.module';
import { PurchaseOrdersModule } from './purchase-orders/purchase-orders.module';
import { ReportsModule } from './reports/reports.module';
import { ImsModule } from './ims/ims.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { RecommendationsModule } from './recommendations/recommendations.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [gatewayConfig],
      envFilePath: ['.env.local', '.env'],
    }),
    TypeOrmModule.forRootAsync({
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get('database.host'),
        port: config.get('database.port'),
        username: config.get('database.username'),
        password: config.get('database.password'),
        database: config.get('database.database'),
        schema: config.get('database.schema', 'public'),
        ssl: config.get('database.ssl'),
        synchronize: config.get('database.synchronize'),
        logging: config.get('database.logging'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        extra: {
          min: config.get('database.poolMin', 5),
          max: config.get('database.poolMax', 20),
        },
      }),
      inject: [ConfigService],
      imports: [ConfigModule],
    }),
    ThrottlerModule.forRootAsync({
      useFactory: (config: ConfigService) => ({
        throttlers: [
          { ttl: config.get('throttleTtl', 900000), limit: config.get('throttleLimit', 100) },
        ],
      }),
      inject: [ConfigService],
      imports: [ConfigModule],
    }),
    ProxyModule,
    HealthModule,
    AuthModule,
    InventoryModule,
    ForecastsModule,
    PurchaseOrdersModule,
    ReportsModule,
    ImsModule,
    DashboardModule,
    RecommendationsModule,
  ],
})
export class AppModule {}
