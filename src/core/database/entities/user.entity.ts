import { Collection, Entity, OneToMany, Property } from '@mikro-orm/core';
import { BaseEntity } from '../base';
import Task from './task.entity';

@Entity({ tableName: 'users' })
class User extends BaseEntity {
  @Property({ unique: true, nullable: false, type: 'varchar' })
  username: string;

  @Property({ nullable: false, type: 'varchar' })
  password: string;

  @OneToMany(() => Task, (task) => task.user, { orphanRemoval: true })
  tasks: Collection<Task>;
}

export default User;
