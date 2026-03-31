import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThrottlerModule } from '@nestjs/throttler';
import appConfig from './config/app.config';
import databaseConfig from './config/database.config';
import jwtConfig from './config/jwt.config';
import throttleConfig from './config/throttle.config';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { RolesModule } from './modules/roles/roles.module';
import { AuditModule } from './modules/audit/audit.module';
import { HealthModule } from './modules/health/health.module';
import { UtilityModule } from './modules/utility/utility.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, databaseConfig, jwtConfig, throttleConfig],
      envFilePath: ['.env.local', '.env'],
    }),
    TypeOrmModule.forRootAsync({
      useFactory: (config) => ({
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
          {
            ttl: config.get<number>('throttle.ttl', 900000),
            limit: config.get<number>('throttle.limit', 100),
          },
        ],
      }),
      inject: [ConfigService],
      imports: [ConfigModule],
    }),
    AuthModule,
    UsersModule,
    RolesModule,
    AuditModule,
    HealthModule,
    UtilityModule,
  ],
})
export class AppModule {}
