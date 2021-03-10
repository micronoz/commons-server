import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';
import {
  __dbhost__,
  __dbname__,
  __dbpassword__,
  __dbport__,
  __dbuser__
} from './constants';
import { join } from 'path';

let OrmConfig = {
  type: 'postgres',
  host: __dbhost__,
  port: __dbport__,
  username: __dbuser__,
  password: __dbpassword__,
  database: __dbname__,
  synchronize: true,
  logging: false,
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
