import { AuthenticationError } from 'apollo-server-express';
import { Request } from 'express';
import { FirebaseUser } from '../model/firebaseUser';

const admin = require('firebase-admin');

export async function decodeToken(req: Request): Promise<FirebaseUser> {
  if (req.headers?.authorization?.startsWith('Bearer ')) {
    const idToken = req.headers.authorization.split('Bearer ')[1];
    try {
      const decodedToken = await admin.auth().verifyIdToken(idToken);
      const firebaseUser = decodedToken as FirebaseUser;
      return firebaseUser;
    } catch (err) {
      console.error(err);
      throw new AuthenticationError('you must be logged in');
    }
  } else {
    throw new AuthenticationError('you must be logged in');
  }
}
