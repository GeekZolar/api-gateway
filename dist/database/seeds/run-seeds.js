"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _dotenv = require("dotenv");
const _path = require("path");
const _typeorm = require("typeorm");
const _1rolesseed = require("./1-roles.seed");
const _2adminuserseed = require("./2-admin-user.seed");
// Load .env from user-management root (src/database/seeds -> ../../../.env)
(0, _dotenv.config)({
    path: (0, _path.resolve)(__dirname, '../../../.env')
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
async function run() {
    const dataSource = new _typeorm.DataSource({
        type: process.env.DB_TYPE,
        host: process.env.DB_HOST,
        port: parsePort(process.env.DB_PORT),
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE,
        schema: process.env.DB_SCHEMA || 'public',
        ssl: parseBool(process.env.DB_SSL),
        synchronize: parseBool(process.env.DB_SYNCHRONIZE),
        entities: [
            __dirname + '/../../modules/**/*.entity{.ts,.js}'
        ]
    });
    await dataSource.initialize();
    try {
        await (0, _1rolesseed.seedRoles)(dataSource);
        await (0, _2adminuserseed.seedAdminUser)(dataSource);
    } finally{
        await dataSource.destroy();
    }
}
run().catch((e)=>{
    console.error(e);
    process.exit(1);
});

//# sourceMappingURL=run-seeds.js.map