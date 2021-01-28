import { Migration } from '@mikro-orm/migrations';

export class Migration20210128074530 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "adventure" ("id" serial primary key, "created_at" jsonb not null, "updated_at" jsonb not null, "title" varchar(255) not null);');
  }

}
