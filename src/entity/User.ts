import { Field, ID, ObjectType } from 'type-graphql';
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
import { UserProfile } from '../model/UserProfile';

@ObjectType()
@Entity()
export class User extends BaseEntity implements UserProfile {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: string;

  @Field(() => String)
  @Column({ unique: true })
  handle: string;

  @Field(() => String)
  @Column({ unique: true })
  email: string;

  @Field(() => String)
  @Column()
  firstName: string;

  @Field(() => String)
  @Column()
  lastName!: string;

  @Field(() => String)
  fullName(): String {
    return `${this.firstName} ${this.lastName}`;
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

  @Field(() => [UserActivity])
  @OneToMany(() => UserActivity, (userActivity) => userActivity.user, {
    cascade: true
  })
  activityConnections: UserActivity[];
}
