import { Field, ObjectType } from 'type-graphql';
import { ChildEntity, Column } from 'typeorm';
import { IActivity } from './IActivity';

@ObjectType({ implements: IActivity })
@ChildEntity()
export class OnlineActivity extends IActivity {
  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  eventUrl: string;
}
