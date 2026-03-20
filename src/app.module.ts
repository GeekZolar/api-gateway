import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import gatewayConfig from './config/gateway.config';
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
    ProxyModule,
    HealthModule,
  ],
})
export class AppModule {}
