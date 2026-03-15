import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThrottlerModule } from '@nestjs/throttler';
import gatewayConfig from './config/gateway.config';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { RolesModule } from './roles/roles.module';
import { InventoryModule } from './inventory/inventory.module';
import { ForecastsModule } from './forecasts/forecasts.module';
import { PurchaseOrdersModule } from './purchase-orders/purchase-orders.module';
import { RecommendationsModule } from './recommendations/recommendations.module';
import { ReportsModule } from './reports/reports.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { ProxyModule } from './proxy/proxy.module';
import { HealthModule } from './health/health.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [gatewayConfig],
      envFilePath: ['.env.local', '.env'],
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
    TypeOrmModule.forRootAsync({
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        url: config.get<string>('databaseUrl'),
        autoLoadEntities: true,
        synchronize: process.env.NODE_ENV === 'production' ? false : process.env.SYNC_DB === 'true',
        logging: process.env.DB_LOGGING === 'true' ? true : ['error'],
        // Fail fast if DB unreachable (e.g. Postgres not running) instead of hanging
        connectTimeoutMS: 10000,
        extra: { connectionTimeoutMillis: 10000 },
      }),
      inject: [ConfigService],
      imports: [ConfigModule],
    }),
    UsersModule,
    AuthModule,
    RolesModule,
    InventoryModule,
    ForecastsModule,
    PurchaseOrdersModule,
    RecommendationsModule,
    ReportsModule,
    DashboardModule,
    ProxyModule,
    HealthModule,
  ],
})
export class AppModule {}
