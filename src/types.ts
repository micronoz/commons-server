import { Response, Request } from 'express';
import { User } from './entity/User';

export type MyContext = {
  req: Request;
  res: Response;
  user: User;
};
