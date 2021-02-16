import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';
import { __dbhost__, __dbpassword__ } from './constants';

let OrmConfig = {
  type: 'postgres',
  host: __dbhost__,
  port: 5432,
  username: 'commons',
  password: __dbpassword__,
  database: 'commons',
  synchronize: true,
  logging: true,
  entities: ['src/entity/**/*.ts'],
  migrations: ['src/migration/**/*.ts'],
  subscribers: ['src/subscriber/**/*.ts'],
  cli: {
    entitiesDir: 'src/entity',
    migrationsDir: 'src/migration',
    subscribersDir: 'src/subscriber'
  }
} as PostgresConnectionOptions;

export { OrmConfig };
