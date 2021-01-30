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

@ObjectType()
class UserResponse {
  @Field(() => User, { nullable: true })
  user?: User;
}

@Resolver()
export class UserResolver {}
