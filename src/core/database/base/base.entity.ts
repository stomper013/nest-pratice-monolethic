import { TimestampUtil } from '@core/utils';
import { PrimaryKey, Property } from '@mikro-orm/core';
import { v4 } from 'uuid';

export class BaseEntity {
  @PrimaryKey({ type: 'uuid' })
  id = v4();

  @Property({ type: 'timestamp' })
  createdAt = TimestampUtil.getCurrentTimestamp();

  @Property({
    type: 'timestamp',
    onUpdate: () => TimestampUtil.getCurrentTimestamp(),
  })
  updatedAt = TimestampUtil.getCurrentTimestamp();

  @Property({ type: 'timestamp', nullable: true, default: null })
  deletedAt?: Date;
}
