import { AuthenticationError } from 'apollo-server-express';
import { Request } from 'express';
import { FirebaseUser } from '../model/firebaseUser';
import { User } from '../entity/User';

const admin = require('firebase-admin');

export async function decodeToken(req: Request): Promise<User> {
  if (req.headers?.authorization?.startsWith('Bearer ')) {
    const idToken = req.headers.authorization.split('Bearer ')[1];
    try {
      const decodedToken = await admin.auth().verifyIdToken(idToken);
      const firebaseUser = decodedToken as FirebaseUser;
      var user = await User.findOne({ email: firebaseUser.email });
      if (user === undefined) {
        user = User.create({
          email: firebaseUser.email,
          fullName: firebaseUser?.name ?? ''
        });
        user = await user.save();
      }
      return user;
    } catch (err) {
      console.error(err);
      throw new AuthenticationError('you must be logged in');
    }
  } else {
    throw new AuthenticationError('you must be logged in');
  }
}
