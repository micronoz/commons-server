import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  UpdateDateColumn,
  BaseEntity,
  CreateDateColumn
} from 'typeorm';
import { Field, ObjectType, ID } from 'type-graphql';

@ObjectType()
@Entity()
export class Activity extends BaseEntity {
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
  @Column({ type: 'text' })
  title!: string;
}
