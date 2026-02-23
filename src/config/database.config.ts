function parseBool(value: string | undefined): boolean | undefined {
  if (value === undefined) return undefined;
  return value === 'true' || value === '1';
}

function parsePort(value: string | undefined): number | undefined {
  if (value === undefined) return undefined;
  const n = parseInt(value, 10);
  return Number.isNaN(n) ? undefined : n;
}

export default () => ({
  database: {
    type: process.env.DB_TYPE as any,
    host: process.env.DB_HOST,
    port: parsePort(process.env.DB_PORT),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    ssl: parseBool(process.env.DB_SSL),
    synchronize: parseBool(process.env.DB_SYNCHRONIZE),
    logging: parseBool(process.env.DB_LOGGING),
    poolMin: parsePort(process.env.DB_POOL_MIN),
    poolMax: parsePort(process.env.DB_POOL_MAX),
  },
});
