import { EntityManager, IDatabaseDriver, Connection } from '@mikro-orm/core';
import { CustomRequest } from './middleware/auth';

export type MyContext = {
  em: EntityManager<any> & EntityManager<IDatabaseDriver<Connection>>;
  req: CustomRequest;
  res: Response;
};
