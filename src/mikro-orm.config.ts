import { __prod__ } from './constants';
import { Adventure } from './entities/Adventure';
import { MikroORM } from '@mikro-orm/core';
import path from 'path';

export default {
  migrations: {
    path: path.join(__dirname, './migrations'),
    pattern: /^[\w-]+\d+\.[tj]s$/
  },
  dbName: 'tribal',
  type: 'postgresql',
  debug: !__prod__,
  entities: [Adventure],
  password: 'password'
} as Parameters<typeof MikroORM.init>[0];
