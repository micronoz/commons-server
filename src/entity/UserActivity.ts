import { Field, ObjectType, Int } from 'type-graphql';
import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  JoinColumn
} from 'typeorm';
import { IActivity } from './IActivity';
import { User } from './User';

@ObjectType()
@Entity()
export class UserActivity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: string;

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.activityConnectionsDb, {
    onDelete: 'CASCADE'
  })
  @JoinColumn({ name: 'userId' })
  user: Promise<User>;

  @Field(() => IActivity)
  @ManyToOne(() => IActivity, (activity) => activity.userConnections, {
    onDelete: 'CASCADE'
  })
  @JoinColumn({ name: 'activityId' })
  activity: Promise<IActivity>;

  @Field()
  @Column()
  isOrganizing: boolean;

  @Field(() => Int)
  @Column({ type: 'int' })
  attendanceStatus: number;
}
