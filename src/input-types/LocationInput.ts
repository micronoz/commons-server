import { Float } from 'type-graphql';
import { Field } from 'type-graphql/dist/decorators/Field';
import { InputType } from 'type-graphql/dist/decorators/InputType';

@InputType()
export class LocationInput {
  @Field(() => Float)
  xLocation: number;

  @Field(() => Float)
  yLocation: number;
}
