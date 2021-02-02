import { EntityManager, IDatabaseDriver, Connection } from '@mikro-orm/core';
import { FirebaseUser } from './model/firebaseUser';

export type MyContext = {
  em: EntityManager<any> & EntityManager<IDatabaseDriver<Connection>>;
  req: Request;
  res: Response;
  user: FirebaseUser;
};
