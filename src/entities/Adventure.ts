import { Entity, PrimaryKey, Property } from '@mikro-orm/core/decorators';

@Entity()
export class Adventure {
  @PrimaryKey()
  id!: number;

  @Property()
  createdAt = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt = new Date();

  @Property()
  title!: string;
}
