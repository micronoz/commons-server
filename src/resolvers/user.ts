import {
  Arg,
  Ctx,
  Field,
  InputType,
  Mutation,
  ObjectType,
  Query,
  Resolver
} from 'type-graphql';

import argon2 from 'argon2';

import { User } from '../entities/User';
import { MyContext } from '../types';

@InputType()
class UsernamePasswordInput {
  @Field()
  username: string;

  @Field()
  password: string;
}

@ObjectType()
class FieldError {
  @Field()
  field: string;
  @Field()
  message: string;
}

@ObjectType()
class UserResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];

  @Field(() => User, { nullable: true })
  user?: User;
}

@Resolver()
export class UserResolver {
  @Mutation(() => UserResponse, { nullable: true })
  async register(
    @Arg('options') options: UsernamePasswordInput,
    @Ctx() { em }: MyContext
  ): Promise<UserResponse | null> {
    if (options.username.length <= 1) {
      return {
        errors: [
          {
            field: 'username',
            message: 'username length must be greater than 1'
          }
        ]
      };
    }

    if (options.password.length < 6) {
      return {
        errors: [
          {
            field: 'password',
            message: 'password must be at least 6 characters'
          }
        ]
      };
    }

    const hash = await argon2.hash(options.password);
    const user = em.create(User, {
      username: options.username,
      password: hash
    });
    try {
      await em.persistAndFlush(user);
    } catch (err) {
      return { errors: [{ field: 'unknown', message: err.message }] };
    }
    return { user };
  }

  @Query(() => UserResponse)
  async login(
    @Arg('options') options: UsernamePasswordInput,
    @Ctx() { em }: MyContext
  ): Promise<UserResponse> {
    const user = await em.findOne(User, { username: options.username });
    if (!user) {
      return {
        errors: [{ field: 'username', message: 'username does not exists' }]
      };
    }
    const valid = await argon2.verify(user.password, options.password);

    if (!valid) {
      return {
        errors: [{ field: 'password', message: 'incorrect password' }]
      };
    }

    return { user };
  }
}
