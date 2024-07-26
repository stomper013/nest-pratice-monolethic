import { Options } from '@mikro-orm/core';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import { config } from 'dotenv';
import { join } from 'path';
config();

const options: Options = {
  driver: PostgreSqlDriver,
  dbName: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PWD,
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  entities: ['dist/**/*.entity.js'],
  migrations: {
    path: join(__dirname, './migrations'),
  },
};

export default options;
