import { Resolver, Query, Ctx, Arg } from 'type-graphql';
import { User } from '../entity/User';
import { MyContext } from '../types';

@Resolver()
export class UserResolver {
  @Query(() => User)
  myUser(@Ctx() { user }: MyContext): User {
    return user;
  }

  @Query(() => User)
  getUser(
    // @Ctx() { user }: MyContext,
    @Arg('email') email: string
  ): Promise<User> {
    return User.findOneOrFail({ email });
  }

  //   @Query(() => User)
  //   users(): Promise<User> {
  //     return User.findOneOrFail({ email: 'hi@gmail.com' });
  //   }
}
