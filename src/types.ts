import { EntityManager } from 'typeorm';
import { Response, Request } from 'express';
import { User } from './entity/User';

export type MyContext = {
  em: EntityManager;
  req: Request;
  res: Response;
  user: User;
};
