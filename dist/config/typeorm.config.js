"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = require("dotenv");
const typeorm_1 = require("typeorm");
const path_1 = require("path");
(0, dotenv_1.config)({ path: (0, path_1.resolve)(__dirname, '../../.env') });
function parseBool(value) {
    if (value === undefined)
        return undefined;
    return value === 'true' || value === '1';
}
function parsePort(value) {
    if (value === undefined)
        return undefined;
    const n = parseInt(value, 10);
    return Number.isNaN(n) ? undefined : n;
}
exports.default = new typeorm_1.DataSource({
    type: process.env.DB_TYPE,
    host: process.env.DB_HOST,
    port: parsePort(process.env.DB_PORT),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    ssl: parseBool(process.env.DB_SSL),
    synchronize: parseBool(process.env.DB_SYNCHRONIZE),
    logging: parseBool(process.env.DB_LOGGING),
    entities: [__dirname + '/**/*.entity{.ts,.js}'],
    migrations: [__dirname + '/../database/migrations/*{.ts,.js}'],
});
//# sourceMappingURL=typeorm.config.js.map