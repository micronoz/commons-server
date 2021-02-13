import { FirebaseUser } from './model/firebaseUser';
import { EntityManager } from 'typeorm';
import { Response, Request } from 'express';

export type MyContext = {
  em: EntityManager;
  req: Request;
  res: Response;
  user: FirebaseUser;
};
