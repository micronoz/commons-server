import { Field, ObjectType, Int } from 'type-graphql';
import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn
} from 'typeorm';
import { Activity } from './Activity';
import { User } from './User';

@ObjectType()
@Entity()
export class UserActivity extends BaseEntity {
  @PrimaryColumn()
  userId: string;

  @PrimaryColumn()
  activityId: string;

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.activityConnections, {
    onDelete: 'CASCADE'
  })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Field(() => Activity)
  @ManyToOne(() => Activity, (activity) => activity.userConnections, {
    onDelete: 'CASCADE'
  })
  @JoinColumn({ name: 'activityId' })
  activity: Activity;

  @Field()
  @Column()
  isOrganizing: boolean;

  @Field(() => Int)
  @Column({ type: 'int' })
  attendanceStatus: number;
}
