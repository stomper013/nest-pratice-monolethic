import { WithSoftDelete } from '@core/common';
import { TimestampUtil } from '@core/utils';
import { OptionalProps, PrimaryKey, Property } from '@mikro-orm/core';
import { v4 } from 'uuid';

@WithSoftDelete()
export class BaseEntity<Optional = never> {
  [OptionalProps]?: 'createdAt' | 'updatedAt' | 'deletedAt' | Optional;

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
