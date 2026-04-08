"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
require("reflect-metadata");
const _fs = require("fs");
const _path = require("path");
const _core = require("@nestjs/core");
const _config = require("@nestjs/config");
const _common = require("@nestjs/common");
const _swagger = require("@nestjs/swagger");
const _helmet = /*#__PURE__*/ _interop_require_default(require("helmet"));
const _appmodule = require("./app.module");
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
async function bootstrap() {
    const app = await _core.NestFactory.create(_appmodule.AppModule);
    const config = app.get(_config.ConfigService);
    app.useGlobalPipes(new _common.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true
    }));
    app.use((0, _helmet.default)({
        contentSecurityPolicy: process.env.NODE_ENV === 'production',
        crossOriginEmbedderPolicy: false
    }));
    const origins = config.get('allowedOrigins', '*');
    app.enableCors({
        origin: typeof origins === 'string' ? origins.split(',').map((o)=>o.trim()) : '*',
        credentials: true,
        methods: [
            'GET',
            'POST',
            'PUT',
            'PATCH',
            'DELETE',
            'OPTIONS'
        ],
        allowedHeaders: [
            'Content-Type',
            'Authorization',
            'X-Correlation-ID'
        ]
    });
    const port = config.get('port', 3000);
    const prefix = config.get('apiPrefix', 'api/v1');
    app.setGlobalPrefix(prefix, {
        exclude: [
            'docs',
            'docs-json',
            'docs-json/(.*)'
        ]
    });
    let swaggerReady = false;
    if (process.env.SWAGGER_DISABLED !== 'true') {
        try {
            const swaggerConfig = new _swagger.DocumentBuilder().setTitle('API Gateway').setDescription('Auth, users, roles, inventory, warehouses, products, health').setVersion('1.0').addBearerAuth().addTag('auth', 'Login, refresh, logout, password reset').addTag('users', 'Register, profile, update').addTag('roles', 'List roles').addTag('inventory', 'Inventory list, by SKU, expiring, adjust, transfer').addTag('warehouses', 'List and create warehouses').addTag('products', 'List and create products').addTag('health', 'Health check').addTag('root', 'Service info').build();
            const document = _swagger.SwaggerModule.createDocument(app, swaggerConfig);
            _swagger.SwaggerModule.setup('docs', app, document);
            swaggerReady = true;
        } catch (err) {
            try {
                const staticPath = (0, _path.join)(process.cwd(), 'openapi.json');
                const doc = JSON.parse((0, _fs.readFileSync)(staticPath, 'utf-8'));
                _swagger.SwaggerModule.setup('docs', app, doc);
                swaggerReady = true;
                console.warn('Swagger using static openapi.json (some endpoints may be missing)');
            } catch  {
                console.warn('Swagger skipped:', err?.message ?? err);
            }
        }
    }
    await app.listen(port);
    console.log(`API Gateway running on http://localhost:${port}/${prefix}`);
    if (swaggerReady) console.log(`Swagger UI: http://localhost:${port}/docs`);
}
bootstrap().catch((err)=>{
    console.error('Bootstrap failed:', err);
    process.exit(1);
});

//# sourceMappingURL=main.js.map