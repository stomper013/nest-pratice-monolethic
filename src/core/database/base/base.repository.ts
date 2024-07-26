import { IPagination, IPaginationResponse } from '@core/interfaces';
import { TimestampUtil } from '@core/utils';
import {
  EntityManager,
  EntityName,
  FilterQuery,
  FindOneOptions,
  FindOptions,
  Loaded,
} from '@mikro-orm/postgresql';
import { HttpException, HttpStatus } from '@nestjs/common';

export class BaseRepository {
  async getOne<
    Entity extends object,
    Hint extends string = never,
    Fields extends string = '*',
    Excludes extends string = never,
  >(
    em: EntityManager,
    entity: EntityName<Entity>,
    where?: FilterQuery<NoInfer<Entity>>,
    options?: FindOneOptions<Entity, Hint, Fields, Excludes>,
  ): Promise<Loaded<Entity, Hint, Fields, Excludes>> {
    try {
      const record = await em.findOne(entity, where, options);
      return record;
    } catch (error) {
      throw new HttpException(
        error?.message || null,
        error?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getMany<
    Entity extends object,
    Hint extends string = never,
    Fields extends string = '*',
    Excludes extends string = never,
  >(
    em: EntityManager,
    entity: EntityName<Entity>,
    where?: FilterQuery<NoInfer<Entity>>,
    options?: FindOptions<Entity, Hint, Fields, Excludes>,
  ): Promise<Array<Loaded<Entity, Hint, Fields, Excludes>>> {
    try {
      const record = await em.find(entity, where, options);

      return record;
    } catch (error) {
      throw new HttpException(
        error?.message || null,
        error?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getPaginate<
    Entity extends object,
    Hint extends string = never,
    Fields extends string = '*',
    Excludes extends string = never,
  >(
    em: EntityManager,
    entity: EntityName<Entity>,
    paginate: IPagination,
    where?: FilterQuery<NoInfer<Entity>>,
    options?: FindOptions<Entity, Hint, Fields, Excludes>,
  ): Promise<IPaginationResponse<Loaded<Entity, Hint, Fields, Excludes>>> {
    try {
      const { page, size } = paginate;
      const optionPaginate: FindOptions<Entity, Hint, Fields, Excludes> =
        Object.assign(options, {
          offset: (page - 1) * size,
          limit: size,
        });

      const [records, total] = await em.findAndCount(
        entity,
        where,
        optionPaginate,
      );

      return { results: records, total };
    } catch (error) {
      throw new HttpException(
        error?.message || null,
        error?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async insert<Entity extends object>(
    em: EntityManager,
    entity: EntityName<Entity>,
    payload: Entity,
  ): Promise<Entity> {
    try {
      const record = em.create(entity, payload);

      em.persist(record);
      await em.flush();

      return record;
    } catch (error) {
      throw new HttpException(
        error?.message || null,
        error?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async update<Entity extends object>(
    em: EntityManager,
    entity: EntityName<Entity>,
    payload: Partial<Entity>,
    where?: FilterQuery<NoInfer<Entity>>,
  ): Promise<Array<Entity>> {
    try {
      const records = await em.find(entity, where);

      em.persist(records.map((record) => Object.assign(record, payload)));
      await em.flush();

      return records;
    } catch (error) {
      throw new HttpException(
        error?.message || null,
        error?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async delete<Entity extends object>(
    em: EntityManager,
    entity: EntityName<Entity>,
    where?: FilterQuery<NoInfer<Entity>>,
  ): Promise<boolean> {
    try {
      const records = await em.find(entity, where);

      await em.removeAndFlush(records);

      return true;
    } catch (error) {
      throw new HttpException(
        error?.message || null,
        error?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async softDelete<Entity extends object>(
    em: EntityManager,
    entity: EntityName<Entity>,
    where?: FilterQuery<NoInfer<Entity>>,
  ): Promise<boolean> {
    try {
      const records = await em.find(entity, where);

      em.persist(
        records.map((record) =>
          Object.assign(record, {
            deletedAt: TimestampUtil.getCurrentTimestamp(),
          }),
        ),
      );
      await em.flush();

      return true;
    } catch (error) {
      throw new HttpException(
        error?.message || null,
        error?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
