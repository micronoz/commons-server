import { ObjectType, Field } from 'type-graphql';

@ObjectType()
export class UserPrivateInfo {
  @Field(() => String)
  email: string;
}
