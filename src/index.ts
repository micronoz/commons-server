import 'reflect-metadata';
import { __prod__, __dbhost__ } from './constants';
import { createConnection } from 'typeorm';
import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql';
import { ActivityResolver } from './resolvers/activity';
import { UserResolver } from './resolvers/user';
import { decodeToken } from './middleware/auth';
import { OrmConfig } from './ormconfig';

const express = require('express');
//const connectRedis = require('connect-redis');
//const session = require('express-session');

const main = async () => {
  const connection = await createConnection(OrmConfig);
  const app = express();

  //const RedisStore = connectRedis(session);

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [ActivityResolver, UserResolver]
    }),
    context: async ({ req }) => {
      {
        const user = await decodeToken(req);
        return { user, em: connection.manager };
      }
    }
  });

  apolloServer.applyMiddleware({ app });
  app.listen(4000, () => {
    console.log('Server started on localhost:4000');
  });
};

main().catch((err) => {
  console.log(err);
});
