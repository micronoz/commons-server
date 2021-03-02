import { Field, Float, ObjectType } from 'type-graphql';

@ObjectType()
export class Location {
  @Field(() => Float)
  x: Number;
  @Field(() => Float)
  y: Number;

  constructor(x: Number, y: Number) {
    this.x = x;
    this.y = y;
  }
}
