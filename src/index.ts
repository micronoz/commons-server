import 'reflect-metadata';
import { __prod__, __dbhost__, __firebaseKey__, __port__ } from './constants';
import { createConnection } from 'typeorm';
import { ApolloServer, AuthenticationError } from 'apollo-server-express';
import { buildSchema } from 'type-graphql';
import { ActivityResolver } from './resolvers/activity';
import { UserResolver } from './resolvers/user';
import { decodeToken } from './middleware/auth';
import { OrmConfig } from './ormconfig';
import { MessageResolver } from './resolvers/message';
import { User } from './entity/User';
import { MyContext } from './types';

const express = require('express');
const admin = require('firebase-admin');
//const connectRedis = require('connect-redis');
//const session = require('express-session');

const main = async () => {
  var serviceAccount;
  if (__prod__) {
    let data = __firebaseKey__;
    let buff = Buffer.from(data, 'base64');
    let key = buff.toString('utf-8');
    serviceAccount = JSON.parse(key);
  } else {
    serviceAccount = require('../secrets/serviceAccountKey.json');
  }
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });

  await createConnection(OrmConfig);
  const app = express();
  //const RedisStore = connectRedis(session);

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [ActivityResolver, UserResolver, MessageResolver]
    }),
    context: async ({ req }) => {
      {
        const firebaseUser = await decodeToken(req);
        const getUser = async () => {
          const user = await User.findOne({ email: firebaseUser.email });
          if (user == null) {
            throw new AuthenticationError(
              `User with email '${firebaseUser.email}' has not been created`
            );
          }
          return user;
        };
        return { getUser, firebaseUser } as MyContext;
      }
    }
  });
  var port = __port__;
  apolloServer.applyMiddleware({ app });
  app.get('/', function (_req: any, res: { send: (arg0: string) => void }) {
    res.send('hello world');
  });
  app.listen(port, () => {
    console.log('Server started on localhost:' + port);
  });
};

main().catch((err) => {
  console.log(err);
});
