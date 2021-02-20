import 'reflect-metadata';
import { __prod__, __dbhost__, __firebaseKey__, __port__ } from './constants';
import { createConnection, EntityManager } from 'typeorm';
import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql';
import { ActivityResolver } from './resolvers/activity';
import { UserResolver } from './resolvers/user';
import { decodeToken } from './middleware/auth';
import { OrmConfig } from './ormconfig';
import { emit } from 'process';

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
      resolvers: [ActivityResolver, UserResolver]
    }),
    context: async ({ req }) => {
      {
        const user = await decodeToken(req);
        return { user };
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
