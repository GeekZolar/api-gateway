import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import helmet from 'helmet';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);

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
  app.setGlobalPrefix(prefix);

  await app.listen(port);
  console.log(`API Gateway running on http://localhost:${port}/${prefix}`);
}

bootstrap().catch((err) => {
  console.error('Bootstrap failed:', err);
  process.exit(1);
});
