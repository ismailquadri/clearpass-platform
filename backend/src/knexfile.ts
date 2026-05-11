/* eslint-disable @typescript-eslint/no-require-imports */
require('dotenv/config');

const base = {
  client: 'pg',
  connection: process.env.DATABASE_URL ?? {
    host: process.env.DB_HOST ?? 'localhost',
    port: Number(process.env.DB_PORT ?? 5432),
    database: process.env.DB_NAME ?? 'clearpass',
    user: process.env.DB_USER ?? 'clearpass',
    password: process.env.DB_PASSWORD ?? 'clearpass123',
  },
  migrations: {
    directory: './src/db/migrations',
    extension: 'ts',
  },
  seeds: {
    directory: './src/db/seeds',
    extension: 'ts',
  },
};

const config = {
  development: { ...base, pool: { min: 2, max: 10 } },
  test: {
    ...base,
    connection: process.env.TEST_DATABASE_URL ?? {
      host: process.env.DB_HOST ?? 'localhost',
      port: Number(process.env.DB_PORT ?? 5432),
      database: `${process.env.DB_NAME ?? 'clearpass'}_test`,
      user: process.env.DB_USER ?? 'clearpass',
      password: process.env.DB_PASSWORD ?? 'clearpass123',
    },
  },
  production: {
    ...base,
    pool: { min: 2, max: 20 },
    connection: {
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false },
    },
  },
};

module.exports = config;
