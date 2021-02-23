import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  UpdateDateColumn,
  BaseEntity,
  CreateDateColumn,
  OneToMany
} from 'typeorm';
import { Field, ObjectType, ID, Int } from 'type-graphql';
import { UserActivity } from './UserActivity';
import { Message } from './Message';

@ObjectType()
@Entity()
export class Activity extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: string;

  @Field(() => String)
  @CreateDateColumn({ type: 'timestamp with time zone', default: 'NOW()' })
  createdAt: Date;

  @Field(() => String)
  @UpdateDateColumn({
    type: 'timestamp with time zone',
    onUpdate: 'NOW()'
  })
  updatedAt: Date;

  @Field()
  @Column()
  title: string;

  @Field(() => String)
  @Column()
  description: string;

  @Field(() => String)
  @Column()
  mediumType: string;

  @Field(() => String)
  @Column({ type: 'point' })
  location: string;

  @Field(() => String, { nullable: true })
  @Column({ type: 'timestamp with time zone', nullable: true })
  eventDateTime: Date;

  @Field(() => String)
  @Column({ nullable: true })
  address: string;

  @Field(() => Int)
  @Column({ type: 'int', nullable: true })
  maxGroupSize: number;

  @Field(() => Int)
  @Column({ type: 'int' })
  visibility: number;

  // @Field(() => Boolean)
  // @Column()
  // requireApproval: boolean;

  // @Field(() => String)
  // @Column({ nullable: true })
  // photoUrl: string;

  @OneToMany(() => UserActivity, (userActivity) => userActivity.activity, {
    cascade: true
  })
  userConnections: UserActivity[];

  @OneToMany(() => Message, (message) => message.activity, {
    cascade: true
  })
  messageConnections: Message[];
}
