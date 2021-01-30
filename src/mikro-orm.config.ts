import { __prod__ } from './constants';
import { Adventure } from './entities/Adventure';
import { Options } from '@mikro-orm/core';
import path from 'path';
import { User } from './entities/User';

export default {
  migrations: {
    path: path.join(__dirname, './migrations'),
    pattern: /^[\w-]+\d+\.[tj]s$/
  },
  dbName: 'tribal',
  type: 'postgresql',
  debug: !__prod__,
  entities: [Adventure, User],
  user: 'tribal',
  password: 'tribal'
} as Options;
