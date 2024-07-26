import { Filter } from '@mikro-orm/core';

interface FilterArguments {
  getAll?: boolean;
  getOnlyDeleted?: boolean;
}

export const WithSoftDelete = (): ClassDecorator => {
  return Filter({
    name: 'softDelete',
    cond: ({ getAll, getOnlyDeleted }: FilterArguments = {}) => {
      if (getAll) return {};

      if (getOnlyDeleted)
        return {
          deletedAt: {
            $ne: null,
          },
        };

      return {
        deletedAt: null,
      };
    },
    default: true,
  });
};
