import { Response, Request } from 'express';
import { User } from './entity/User';
import { FirebaseUser } from './model/firebaseUser';

export class MyContext {
  public req: Request;
  public res: Response;
  public getUser: () => Promise<User>;
  public firebaseUser: FirebaseUser;
}
