import { FirebaseUser } from './model/firebaseUser';
import { EntityManager, Connection } from 'typeorm';

export type MyContext = {
  em: EntityManager;
  req: Request;
  res: Response;
  user: FirebaseUser;
};
