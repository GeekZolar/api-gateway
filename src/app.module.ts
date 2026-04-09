import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThrottlerModule } from '@nestjs/throttler';
import gatewayConfig from './config/gateway.config';
import databaseConfig from './config/database.config';
import jwtConfig from './config/jwt.config';
import { HealthModule } from './health/health.module';
import { InventoryModule } from './inventory/inventory.module';
import { ForecastsModule } from './forecasts/forecasts.module';
import { PurchaseOrdersModule } from './purchase-orders/purchase-orders.module';
import { ReportsModule } from './reports/reports.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { RecommendationsModule } from './recommendations/recommendations.module';
// sola_dev modules
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { RolesModule } from './modules/roles/roles.module';
import { AuditModule } from './modules/audit/audit.module';
import { UtilityModule } from './modules/utility/utility.module';
import { CommonModule } from './common/common.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [gatewayConfig, databaseConfig, jwtConfig],
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
        entities: [
          __dirname + '/inventory/**/*.entity{.ts,.js}',
          __dirname + '/forecasts/**/*.entity{.ts,.js}',
          __dirname + '/purchase-orders/**/*.entity{.ts,.js}',
          __dirname + '/reports/**/*.entity{.ts,.js}',
          __dirname + '/modules/**/*.entity{.ts,.js}',
        ],
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
    CommonModule,
    HealthModule,
    InventoryModule,
    ForecastsModule,
    PurchaseOrdersModule,
    ReportsModule,
    DashboardModule,
    RecommendationsModule,
    AuthModule,
    UsersModule,
    RolesModule,
    AuditModule,
    UtilityModule,
  ],
})
export class AppModule {}
