import { Field, ObjectType } from 'type-graphql';
import {
  Entity,
  Column,
  UpdateDateColumn,
  CreateDateColumn,
  OneToMany,
  BaseEntity,
  PrimaryColumn
} from 'typeorm';
import { UserActivity } from './UserActivity';
import { UserProfile } from '../model/UserProfile';

@ObjectType()
@Entity()
export class User extends BaseEntity implements UserProfile {
  @Field(() => String)
  @PrimaryColumn({ unique: true })
  email!: string;

  @Field(() => String)
  @Column()
  fullName!: string;

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

  @Field(() => [UserActivity])
  @OneToMany(() => UserActivity, (userActivity) => userActivity.user, {
    cascade: true
  })
  activityConnections: UserActivity[];
}
