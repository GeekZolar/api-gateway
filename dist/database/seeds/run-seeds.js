"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = require("dotenv");
const path_1 = require("path");
const typeorm_1 = require("typeorm");
const _1_roles_seed_1 = require("./1-roles.seed");
const _2_admin_user_seed_1 = require("./2-admin-user.seed");
(0, dotenv_1.config)({ path: (0, path_1.resolve)(__dirname, '../../../.env') });
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
async function run() {
    const dataSource = new typeorm_1.DataSource({
        type: process.env.DB_TYPE,
        host: process.env.DB_HOST,
        port: parsePort(process.env.DB_PORT),
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE,
        ssl: parseBool(process.env.DB_SSL),
        synchronize: parseBool(process.env.DB_SYNCHRONIZE),
        entities: [__dirname + '/../../modules/**/*.entity{.ts,.js}'],
    });
    await dataSource.initialize();
    try {
        await (0, _1_roles_seed_1.seedRoles)(dataSource);
        await (0, _2_admin_user_seed_1.seedAdminUser)(dataSource);
    }
    finally {
        await dataSource.destroy();
    }
}
run().catch((e) => {
    console.error(e);
    process.exit(1);
});
//# sourceMappingURL=run-seeds.js.map