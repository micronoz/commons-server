import { ApolloError } from 'apollo-server-express';
import { Resolver, Query, Ctx, Mutation, Arg } from 'type-graphql';
import { User } from '../entity/User';
import { MyContext } from '../types';

@Resolver()
export class UserResolver {
  @Query(() => User, { nullable: true })
  async user(@Ctx() { getUser }: MyContext): Promise<User> {
    const user = await getUser(false);
    return user;
  }

  @Query(() => Boolean)
  async isUserHandleTaken(@Arg('userHandle') handle: string): Promise<Boolean> {
    const userFound = await User.findOne({ where: { handle: handle } });
    console.log(userFound);
    if (userFound) {
      return true;
    } else {
      return false;
    }
  }

  @Mutation(() => User)
  async createUser(
    @Ctx() { firebaseUser }: MyContext,
    @Arg('firstName') firstName: string,
    @Arg('lastName') lastName: string,
    @Arg('handle') handle: string
  ) {
    const newUser = User.create({
      handle: handle,
      email: firebaseUser.email,
      firstName: firstName,
      lastName: lastName
    });
    await newUser.save();
    return newUser;
  }

  //TODO: Delete
  @Query(() => [User])
  async users(): Promise<User[]> {
    const users = await User.find();
    return users;
  }

  @Mutation(() => Boolean)
  async deleteAllUsers(): Promise<boolean> {
    await User.remove(await User.find());
    return true;
  }
}
