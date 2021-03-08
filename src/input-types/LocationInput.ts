import { Double } from 'typeorm';
import { Float } from 'type-graphql';
import { Field } from 'type-graphql/dist/decorators/Field';
import { InputType } from 'type-graphql/dist/decorators/InputType';

@InputType()
export class LocationInput {
  @Field(() => Float)
  xLocation: Double;

  @Field(() => Float)
  yLocation: Double;
}
