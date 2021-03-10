import { ObjectType, Field, Float } from 'type-graphql';
import { InPersonActivity } from './InPersonActivity';

@ObjectType()
export class InPersonActivityRecommendation {
  @Field(() => InPersonActivity)
  activity: InPersonActivity;

  @Field(() => Float)
  distance: number;
}
