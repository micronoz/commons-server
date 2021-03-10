import { Response, Request } from 'express';
import { User } from './entity/User';
import { FirebaseUser } from './model/firebaseUser';

export class MyContext {
  req: Request;
  res: Response;
  get getUser(): Promise<User> {
    return this._getUser();
  }
  private _getUser: () => Promise<User>;
  firebaseUser: FirebaseUser;
}
