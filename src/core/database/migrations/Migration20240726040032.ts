import { Migration } from '@mikro-orm/migrations';

export class Migration20240726040032 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'create table "users" ("id" uuid not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, "deleted_at" timestamptz null, "username" varchar(255) not null, "password" varchar(255) not null, "token" varchar(255) null, "token_expire_date" timestamptz null, constraint "users_pkey" primary key ("id"));',
    );
    this.addSql(
      'alter table "users" add constraint "users_username_unique" unique ("username");',
    );

    this.addSql(
      'create table "tasks" ("id" uuid not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, "deleted_at" timestamptz null, "title" varchar(255) not null, "description" varchar(255) not null, "status" text check ("status" in (\'DONE\', \'NOT_YET\')) not null default \'NOT_YET\', "deadline" timestamptz null, "user_id" uuid not null, constraint "tasks_pkey" primary key ("id"));',
    );

    this.addSql(
      'alter table "tasks" add constraint "tasks_user_id_foreign" foreign key ("user_id") references "users" ("id") on update cascade;',
    );
  }

  async down(): Promise<void> {
    this.addSql('alter table "tasks" drop constraint "tasks_user_id_foreign";');

    this.addSql('drop table if exists "users" cascade;');

    this.addSql('drop table if exists "tasks" cascade;');
  }
}
