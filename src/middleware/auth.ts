import { NextFunction, Request, Response } from 'express';
import { MiddlewareFn } from 'type-graphql';
import { MyContext } from '../types';

const admin = require('firebase-admin');
admin.initializeApp();

export interface CustomRequest extends Request {
  currentUser: any;
}

export async function decodeToken(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  console.log('Decoding token');
  if (req.headers?.authorization?.startsWith('Bearer ')) {
    const idToken = req.headers.authorization.split('Bearer ')[1];

    try {
      const decodedToken = await admin.auth().verifyIdToken(idToken);
      (req as CustomRequest)['currentUser'] = decodedToken;
    } catch (err) {
      console.error(err);
      res.status(403).send('Not authenticated');
    }
  } else {
    res.status(403).send('Not authenticated');
  }

  next();
}
