import { MikroORM } from '@mikro-orm/core';
import { __prod__ } from './constants';
import mikroConfig from './mikro-orm.config';
import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql';
import { AdventureResolver } from './resolvers/adventure';
import 'reflect-metadata';
import { UserResolver } from './resolvers/user';
import connectRedis from 'connect-redis';
import session from 'express-session';
import { decodeToken } from './middleware/auth';

const main = async () => {
  const orm = await MikroORM.init(mikroConfig);
  orm.getMigrator().up();

  const app = express();

  const RedisStore = connectRedis(session);

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [AdventureResolver, UserResolver]
    }),
    context: async ({ req }) => {
      {
        const user = await decodeToken(req);
        return { user, em: orm.em };
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
