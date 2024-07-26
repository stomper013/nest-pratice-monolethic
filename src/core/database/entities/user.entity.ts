import { Collection, Entity, OneToMany, Property } from '@mikro-orm/core';
import { BaseEntity } from '../base';
import { Task } from './task.entity';

@Entity({ tableName: 'users' })
export class User extends BaseEntity {
  @Property({ unique: true, nullable: false, type: 'varchar' })
  username: string;

  @Property({ nullable: false, type: 'varchar' })
  password?: string;

  @Property({ nullable: true, type: 'varchar' })
  token?: string;

  @Property({ nullable: true, type: 'timestamp' })
  tokenExpireDate?: Date;

  @OneToMany(() => Task, (task) => task.user, { orphanRemoval: true })
  tasks? = new Collection<Task>(this);
}
