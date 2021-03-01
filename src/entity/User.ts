import { Field, ID, ObjectType, Arg, Ctx } from 'type-graphql';
import {
  Entity,
  Column,
  UpdateDateColumn,
  CreateDateColumn,
  OneToMany,
  BaseEntity,
  PrimaryGeneratedColumn
} from 'typeorm';
import { UserActivity } from './UserActivity';
import { UserPrivateInfo } from '../model/UserPrivateInfo';
import { MyContext } from 'src/types';

@ObjectType()
@Entity()
export class User extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: string;

  @Field(() => String)
  @Column({ unique: true })
  handle: string;

  @Column({ unique: true })
  email: string;

  @Field(() => String)
  @Column()
  firstName: string;

  @Field(() => String)
  @Column()
  lastName: string;

  @Field(() => String)
  fullName(): String {
    return `${this.firstName} ${this.lastName}`;
  }

  @Field(() => UserPrivateInfo)
  private(@Ctx() { user }: MyContext): UserPrivateInfo {
    return user as UserPrivateInfo;
  }

  @Field(() => String)
  @CreateDateColumn({ type: 'timestamp without time zone', default: 'NOW()' })
  createdAt!: Date;

  @Field(() => String)
  @UpdateDateColumn({
    type: 'timestamp without time zone',
    onUpdate: 'NOW()',
    nullable: true
  })
  updatedAt?: Date;

  @OneToMany(() => UserActivity, (userActivity) => userActivity.user, {
    cascade: true
  })
  activityConnectionsDb: Promise<UserActivity[]>;

  @Field(() => [UserActivity])
  async activityConnections(
    @Arg('limit', { nullable: true }) limit?: number
  ): Promise<UserActivity[]> {
    if (limit === undefined) {
      return this.activityConnectionsDb;
    }
    const userActivities = await this.activityConnectionsDb;
    return userActivities.slice(0, limit);
  }
}
