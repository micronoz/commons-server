import { BaseEntity, Entity, PrimaryColumn, Column, ManyToOne } from 'typeorm';
import { ObjectType, Field, ID } from 'type-graphql';
import { User } from './User';

@ObjectType()
@Entity()
export class Message extends BaseEntity {
  @Field(() => ID)
  @PrimaryColumn({ unique: true })
  id!: string;

  @Field(() => String)
  @Column()
  message!: string;

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.messageConnections, {
    onDelete: 'CASCADE'
  })
  user!: User;
}
