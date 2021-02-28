import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  UpdateDateColumn,
  BaseEntity,
  CreateDateColumn,
  OneToMany
} from 'typeorm';
import { Field, ObjectType, ID, Ctx } from 'type-graphql';
import { UserActivity } from './UserActivity';
import { Message } from './Message';
import { MyContext } from 'src/types';
import { ApolloError } from 'apollo-server-express';

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

  @Field(() => [UserActivity])
  @OneToMany(() => UserActivity, (userActivity) => userActivity.activity, {
    cascade: true
  })
  userConnections: Promise<UserActivity[]>;

  @OneToMany(() => Message, (message) => message.activity, { cascade: true })
  messageConnectionsDb: Promise<Message[]>;

  @Field(() => [Message])
  async messageConnections(@Ctx() { user }: MyContext): Promise<Message[]> {
    try {
      await UserActivity.findOneOrFail({
        where: { user, activity: this } //TODO add condition for if the user has been accepted to the activity
      });
      return this.messageConnectionsDb;
    } catch {
      throw new ApolloError(
        "You do not have access to this Activity's messages."
      );
    }
  }
}
