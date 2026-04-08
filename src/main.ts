import 'reflect-metadata';
import { readFileSync } from 'fs';
import { join } from 'path';
import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  app.use(
    helmet({
      contentSecurityPolicy: process.env.NODE_ENV === 'production',
      crossOriginEmbedderPolicy: false,
    }),
  );

  const origins = config.get<string>('allowedOrigins', '*');
  app.enableCors({
    origin: typeof origins === 'string' ? origins.split(',').map((o) => o.trim()) : '*',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Correlation-ID'],
  });

  const port = config.get<number>('port', 3000);
  const prefix = config.get<string>('apiPrefix', 'api/v1');
  app.setGlobalPrefix(prefix, {
    exclude: ['docs', 'docs-json', 'docs-json/(.*)'],
  });

  let swaggerReady = false;
  if (process.env.SWAGGER_DISABLED !== 'true') {
    try {
      const swaggerConfig = new DocumentBuilder()
        .setTitle('API Gateway')
        .setDescription('Auth, users, roles, inventory, warehouses, products, health')
        .setVersion('1.0')
        .addBearerAuth()
        .addTag('auth', 'Login, refresh, logout, password reset')
        .addTag('users', 'Register, profile, update')
        .addTag('roles', 'List roles')
        .addTag('inventory', 'Inventory list, by SKU, expiring, adjust, transfer')
        .addTag('warehouses', 'List and create warehouses')
        .addTag('products', 'List and create products')
        .addTag('health', 'Health check')
        .addTag('root', 'Service info')
        .build();
      const document = SwaggerModule.createDocument(app, swaggerConfig);
      SwaggerModule.setup('docs', app, document);
      swaggerReady = true;
    } catch (err) {
      try {
        const staticPath = join(process.cwd(), 'openapi.json');
        const doc = JSON.parse(readFileSync(staticPath, 'utf-8'));
        SwaggerModule.setup('docs', app, doc);
        swaggerReady = true;
        console.warn('Swagger using static openapi.json (some endpoints may be missing)');
      } catch {
        console.warn('Swagger skipped:', (err as Error)?.message ?? err);
      }
    }
  }

  await app.listen(port);
  console.log(`API Gateway running on http://localhost:${port}/${prefix}`);
  if (swaggerReady) console.log(`Swagger UI: http://localhost:${port}/docs`);
}

bootstrap().catch((err) => {
  console.error('Bootstrap failed:', err);
  process.exit(1);
});
