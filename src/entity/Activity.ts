import { Location } from './../model/Location';
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
import { Point } from 'geojson';
import { User } from './User';

@ObjectType()
@Entity()
export class Activity extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: string;

  @Field(() => String)
  @CreateDateColumn({
    type: 'timestamp with time zone',
    default: () => 'NOW()'
  })
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

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  description: string;

  @Field(() => String)
  @Column()
  mediumType: string;

  @Column({
    type: 'point',
    transformer: {
      to: (val) => val,
      from(val): String | null {
        if (val) {
          return `(${val.x}, ${val.y})`;
        } else return null;
      }
    },
    nullable: true
  })
  organizerCoordinatesDb: Point;

  @Column({
    type: 'point',
    transformer: {
      to: (val) => val,
      from(val): String | null {
        if (val) {
          return `(${val.x}, ${val.y})`;
        } else return null;
      }
    },
    nullable: true
  })
  eventCoordinatesDb: Point;

  @Field(() => Location, { nullable: true })
  discoveryCoordinates(): Location | null {
    if (this.mediumType === 'online') return null;
    const loc = this.eventCoordinatesDb
      ? this.eventCoordinatesDb
      : this.organizerCoordinatesDb;
    const parsed = loc.toString().slice(1, loc.toString().length - 1);
    const coordinates = parsed.split(',');
    const x = +coordinates[0];
    const y = +coordinates[1];
    return new Location(x, y);
  }

  @Field(() => Location, { nullable: true })
  eventCoordinates(): Location | null {
    if (this.eventCoordinatesDb == null) {
      return null;
    }
    const loc = this.eventCoordinatesDb;
    const parsed = loc.toString().slice(1, loc.toString().length - 1);
    const coordinates = parsed.split(',');
    const x = +coordinates[0];
    const y = +coordinates[1];
    return new Location(x, y);
  }

  @Field(() => String, { nullable: true })
  @Column({ type: 'timestamp with time zone', nullable: true })
  eventDateTime: Date;

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  physicalAddress: string;

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  eventUrl: string;

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

  @Field(() => User)
  async organizer(): Promise<User> {
    const userActivity = await UserActivity.findOneOrFail({
      where: { activity: this, isOrganizing: true }
    });
    return userActivity.user;
  }
}
