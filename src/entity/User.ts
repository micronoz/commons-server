import { Field, ObjectType, ID } from 'type-graphql';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  UpdateDateColumn,
  CreateDateColumn,
  OneToMany
} from 'typeorm';
import { UserActivity } from './UserActivity';

@ObjectType()
@Entity()
export class User {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id!: string;

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

  @Field()
  @Column({ type: 'text', unique: true })
  username!: string;

  @Column({ type: 'text' })
  password!: string;

  @OneToMany(() => UserActivity, (userActivity) => userActivity.user, {
    cascade: true
  })
  activityConnections: UserActivity[];
}
