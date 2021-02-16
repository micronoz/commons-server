import 'reflect-metadata';
import { __prod__, __dbhost__, __firebaseKey__, __port__ } from './constants';
import { createConnection } from 'typeorm';
import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql';
import { AdventureResolver } from './resolvers/adventure';
import { UserResolver } from './resolvers/user';
import { decodeToken } from './middleware/auth';
import { OrmConfig } from './ormconfig';

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

  const connection = await createConnection(OrmConfig);
  const app = express();

  //const RedisStore = connectRedis(session);

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [AdventureResolver, UserResolver]
    }),
    context: async ({ req }) => {
      {
        const user = await decodeToken(req);
        return { user, em: connection.manager };
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
