import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  UpdateDateColumn,
  BaseEntity,
  CreateDateColumn,
  OneToMany
} from 'typeorm';
import { Field, ObjectType, ID } from 'type-graphql';
import { UserActivity } from './UserActivity';
import { Message } from './Message';
// import { Message } from './Message';

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

  // @Field(() => String)
  @Column({ type: 'point' })
  location: string;

  @Field(() => String, { nullable: true })
  @Column({ type: 'timestamp with time zone', nullable: true })
  eventDateTime: Date;

  @Field(() => String)
  @Column({ nullable: true })
  address: string;

  @OneToMany(() => UserActivity, (userActivity) => userActivity.activity, {
    cascade: true
  })
  userConnections: UserActivity[];

  @OneToMany(() => Message, (message) => message.activity, { cascade: true })
  @Field(() => [Message])
  messageConnections: Message[];
}
