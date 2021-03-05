import { Field, ObjectType } from 'type-graphql';
import { ChildEntity, Column } from 'typeorm';
import { Activity } from './Activity';

@ObjectType({ implements: Activity })
@ChildEntity()
export class OnlineActivity extends Activity {
  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  eventUrl: string;
}
