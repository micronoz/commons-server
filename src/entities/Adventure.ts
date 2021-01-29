import { Entity, PrimaryKey, Property } from '@mikro-orm/core/decorators';
import { Field, ObjectType } from 'type-graphql';

@ObjectType()
@Entity()
export class Adventure {
  @Field()
  @PrimaryKey()
  id!: number;

  @Field(() => String)
  @Property({ type: 'date' })
  createdAt = new Date();

  @Field(() => String)
  @Property({ type: 'date', onUpdate: () => new Date() })
  updatedAt = new Date();

  @Field()
  @Property({ type: 'text' })
  title!: string;
}
