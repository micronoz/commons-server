import { AuthenticationError } from 'apollo-server-express';
import { Request } from 'express';
import { performance } from 'perf_hooks';
import { FirebaseUser } from '../model/firebaseUser';

const admin = require('firebase-admin');
var serviceAccount = require('../../secrets/serviceAccountKey.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

export async function decodeToken(req: Request): Promise<FirebaseUser> {
  if (req.headers?.authorization?.startsWith('Bearer ')) {
    const idToken = req.headers.authorization.split('Bearer ')[1];
    try {
      const decodedToken = await admin.auth().verifyIdToken(idToken);
      const user = decodedToken as FirebaseUser;
      return user;
    } catch (err) {
      console.error(err);
      throw new AuthenticationError('you must be logged in');
    }
  } else {
    throw new AuthenticationError('you must be logged in');
  }
}
