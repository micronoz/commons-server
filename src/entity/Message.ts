import {
  BaseEntity,
  Entity,
  Column,
  ManyToOne,
  PrimaryGeneratedColumn
} from 'typeorm';
import { ObjectType, Field, ID } from 'type-graphql';
import { User } from './User';
import { Activity } from './Activity';

@ObjectType()
@Entity()
export class Message extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id!: string;

  @Field(() => String)
  @Column()
  message!: string;

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.messageConnections, {
    onDelete: 'CASCADE'
  })
  user!: User;

  @Field(() => Activity)
  @ManyToOne(() => Activity, (activity) => activity.messageConnections, {
    onDelete: 'CASCADE'
  })
  activity!: Activity;
}
