"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: function() {
        return _default;
    }
});
const _dotenv = require("dotenv");
const _typeorm = require("typeorm");
const _path = require("path");
// Load .env from user-management root (when running migrations via CLI)
(0, _dotenv.config)({
    path: (0, _path.resolve)(__dirname, '../../.env')
});
function parseBool(value) {
    if (value === undefined) return undefined;
    return value === 'true' || value === '1';
}
function parsePort(value) {
    if (value === undefined) return undefined;
    const n = parseInt(value, 10);
    return Number.isNaN(n) ? undefined : n;
}
const _default = new _typeorm.DataSource({
    type: process.env.DB_TYPE,
    host: process.env.DB_HOST,
    port: parsePort(process.env.DB_PORT),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    schema: process.env.DB_SCHEMA || 'public',
    ssl: parseBool(process.env.DB_SSL),
    synchronize: parseBool(process.env.DB_SYNCHRONIZE),
    logging: parseBool(process.env.DB_LOGGING),
    entities: [
        __dirname + '/**/*.entity{.ts,.js}'
    ],
    migrations: [
        __dirname + '/../database/migrations/*{.ts,.js}'
    ]
});

//# sourceMappingURL=typeorm.config.js.map