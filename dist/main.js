"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const config_1 = require("@nestjs/config");
const helmet_1 = require("helmet");
const app_module_1 = require("./app.module");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const config = app.get(config_1.ConfigService);
    app.use((0, helmet_1.default)({
        contentSecurityPolicy: process.env.NODE_ENV === 'production',
        crossOriginEmbedderPolicy: false,
    }));
    const origins = config.get('allowedOrigins', '*');
    app.enableCors({
        origin: typeof origins === 'string' ? origins.split(',').map((o) => o.trim()) : '*',
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization', 'X-Correlation-ID'],
    });
    const port = config.get('port', 3000);
    const prefix = config.get('apiPrefix', 'api/v1');
    app.setGlobalPrefix(prefix);
    await app.listen(port);
    console.log(`API Gateway running on http://localhost:${port}/${prefix}`);
}
bootstrap().catch((err) => {
    console.error('Bootstrap failed:', err);
    process.exit(1);
});
//# sourceMappingURL=main.js.map