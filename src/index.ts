import { MikroORM } from '@mikro-orm/core';
import { __prod__ } from './constants';
import { Adventure } from './entities/Adventure';
import mikroConfig from './mikro-orm.config';

const main = async () => {
  const orm = await MikroORM.init(mikroConfig);
  orm.getMigrator().up();
//   const adventure = orm.em.create(Adventure, { title: 'hi' });
//   await orm.em.persistAndFlush(adventure);
  const adventures = await orm.em.find(Adventure, {});
  console.log(adventures);
};

main();
