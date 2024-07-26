import { ETaskStatus } from '@core/enums';
import { Entity, Enum, ManyToOne, Property } from '@mikro-orm/core';
import { BaseEntity } from '../base';
import { User } from './user.entity';

@Entity({ tableName: 'tasks' })
export class Task extends BaseEntity<'deadline' | 'status'> {
  @Property({ nullable: false, type: 'varchar' })
  title: string;

  @Property({ nullable: false, type: 'varchar' })
  description: string;

  @Enum(() => ETaskStatus)
  status? = ETaskStatus.NotYet;

  @Property({ type: 'timestamp', nullable: true, default: null })
  deadline?: Date;

  @ManyToOne({ entity: () => User })
  user: User;
}
