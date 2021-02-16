import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';
import { __dbhost__, __dbpassword__ } from './constants';
import { join } from 'path';

let OrmConfig = {
  type: 'postgres',
  host: __dbhost__,
  port: 5432,
  username: 'commons',
  password: __dbpassword__,
  database: 'commons',
  synchronize: true,
  logging: true,
  entities: [join(__dirname, 'entity', '*.{ts,js}')],
  migrations: [join(__dirname, 'migration', '*.{ts,js}')],
  subscribers: [join(__dirname, 'subscriber', '*.{ts,js}')],
  cli: {
    entitiesDir: 'src/entity',
    migrationsDir: 'src/migration',
    subscribersDir: 'src/subscriber'
  }
} as PostgresConnectionOptions;

export { OrmConfig };
