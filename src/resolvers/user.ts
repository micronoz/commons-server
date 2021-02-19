import { Resolver, Query, Ctx } from 'type-graphql';
import { User } from '../entity/User';
import { MyContext } from '../types';

@Resolver()
export class UserResolver {
  @Query(() => User)
  user(@Ctx() { user }: MyContext): User {
    return user;
  }

  //   @Query(() => User)
  //   users(): Promise<User> {
  //     return User.findOneOrFail({ email: 'hi@gmail.com' });
  //   }
}
