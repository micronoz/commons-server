import {
  BaseEntity,
  Entity,
  Column,
  ManyToOne,
  PrimaryGeneratedColumn,
  CreateDateColumn
} from 'typeorm';
import { ObjectType, Field, ID } from 'type-graphql';
import { User } from './User';
import { IActivity } from './IActivity';
// import { Activity } from './Activity';

@ObjectType()
@Entity()
export class Message extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: string;

  @Field(() => String)
  @Column()
  message: string;

  @Field(() => User)
  @ManyToOne(() => User, {
    onDelete: 'CASCADE'
  })
  sender: Promise<User>;

  @Field(() => IActivity)
  @ManyToOne(() => IActivity, (activity) => activity.messageConnectionsDb, {
    onDelete: 'CASCADE'
  })
  activity: Promise<IActivity>;

  @Field(() => String)
  @CreateDateColumn({
    type: 'timestamp with time zone',
    default: () => 'NOW()'
  })
  createdAt: Date;
}
