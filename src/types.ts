import { Response, Request } from 'express';
import { User } from './entity/User';
import { FirebaseUser } from './model/firebaseUser';

export type MyContext = {
  req: Request;
  res: Response;
  getUser: () => Promise<User>;
  firebaseUser: FirebaseUser;
};
