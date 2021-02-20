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

@ObjectType()
@Entity()
export class Activity extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: string;

  @Field(() => String)
  @CreateDateColumn({ type: 'timestamp without time zone', default: 'NOW()' })
  createdAt: Date;

  @Field(() => String)
  @UpdateDateColumn({
    type: 'timestamp without time zone',
    onUpdate: 'NOW()',
    nullable: true
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
  @Column()
  location: string;

  @Field(() => String)
  @Column({ type: 'timestamp' })
  eventDateTime: Date;

  @Field(() => Int)
  @Column({ type: 'int', nullable: true })
  maxGroupSize: number;

  @Field(() => Int)
  @Column({ type: 'int', nullable: true })
  matchingSize: number;

  @Field(() => String)
  @Column()
  visibility: string;

  @Field(() => Boolean)
  @Column()
  requireApproval: boolean;

  @Field(() => String)
  @Column({ nullable: true })
  photoUrl: string;

  @Field(() => String)
  @Column()
  price: string;

  @OneToMany(() => UserActivity, (userActivity) => userActivity.activity, {
    cascade: true
  })
  userConnections: UserActivity[];
}
