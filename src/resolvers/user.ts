import { ApolloError } from 'apollo-server-express';
import { Resolver, Query, Ctx, Mutation, Arg } from 'type-graphql';
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

  @Mutation(() => User)
  async createUser(
    @Ctx() { user, firebaseUser }: MyContext,
    @Arg('firstName') firstName: string,
    @Arg('lastName') lastName: string,
    @Arg('handle') handle: string
  ) {
    if (user != null) {
      throw new ApolloError('User already exists');
    }
    const newUser = User.create({
      handle: handle,
      email: firebaseUser.email,
      firstName: firstName,
      lastName: lastName
    });
    await newUser.save();
    return newUser;
  }

  // //TODO: Delete
  // @Query(() => [User])
  // async users(): Promise<User[]> {
  //   const users = await User.find();
  //   return users;
  // }
}
