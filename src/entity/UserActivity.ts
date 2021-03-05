import { Field, ObjectType, Int, ID } from 'type-graphql';
import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  JoinColumn
} from 'typeorm';
import { Activity } from './Activity';
import { User } from './User';

@ObjectType()
@Entity()
export class UserActivity extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: string;

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.activityConnectionsDb, {
    onDelete: 'CASCADE'
  })
  @JoinColumn({ name: 'userId' })
  user: Promise<User>;

  @Field(() => Activity)
  @ManyToOne(() => Activity, (activity) => activity.userConnections, {
    onDelete: 'CASCADE'
  })
  @JoinColumn({ name: 'activityId' })
  activity: Promise<Activity>;

  @Field()
  @Column()
  isOrganizing: boolean;

  @Field(() => Int)
  @Column({ type: 'int' })
  attendanceStatus: number;
}
