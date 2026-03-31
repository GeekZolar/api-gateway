import { config } from 'dotenv';
import { resolve } from 'path';
import { DataSource } from 'typeorm';
import { seedRoles } from './1-roles.seed';
import { seedAdminUser } from './2-admin-user.seed';

// Load .env from user-management root (src/database/seeds -> ../../../.env)
config({ path: resolve(__dirname, '../../../.env') });

function parseBool(value: string | undefined): boolean | undefined {
  if (value === undefined) return undefined;
  return value === 'true' || value === '1';
}

function parsePort(value: string | undefined): number | undefined {
  if (value === undefined) return undefined;
  const n = parseInt(value, 10);
  return Number.isNaN(n) ? undefined : n;
}

async function run() {
  const dataSource = new DataSource({
    type: process.env.DB_TYPE as any,
    host: process.env.DB_HOST,
    port: parsePort(process.env.DB_PORT),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    schema: process.env.DB_SCHEMA || 'public',
    ssl: parseBool(process.env.DB_SSL),
    synchronize: parseBool(process.env.DB_SYNCHRONIZE),
    entities: [__dirname + '/../../modules/**/*.entity{.ts,.js}'],
  });

  await dataSource.initialize();
  try {
    await seedRoles(dataSource);
    await seedAdminUser(dataSource);
  } finally {
    await dataSource.destroy();
  }
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
