import { BaseRepository, Task, User } from '@core/database';
import {
  ICreateTaskPayload,
  IPaginationResponse,
  IQueryTask,
  IUpdateTaskPayload,
} from '@core/interfaces';
import { LoggerService, TimestampUtil } from '@core/utils';
import {
  EntityManager,
  FilterQuery,
  OrderDefinition,
} from '@mikro-orm/postgresql';
import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

@Injectable()
export class TaskService extends BaseRepository {
  private readonly serviceName: string = TaskService.name;
  private readonly logger: LoggerService;
  constructor(
    private readonly entityManager: EntityManager,
    logger: LoggerService,
  ) {
    super();
    this.logger = logger;
    this.logger.setContext(this.serviceName);
  }

  getError(){
    try {
      throw new Error('TEST')
    }catch(error){
      this.logger.debug(error)
      throw new HttpException(
        error?.message || null,
        error?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  
  async getTasksByUserId(
    userId: string,
    query: IQueryTask,
  ): Promise<IPaginationResponse<Task>> {
    const em = this.entityManager.fork();
    try {
      const {
        page,
        size,
        queryFields,
        orderFields,
        startTime = TimestampUtil.startOfDate(new Date(0)),
        endTime = TimestampUtil.getCurrentTimestamp(),
      } = query;
      const { title, status, deadline } = queryFields;

      const where: FilterQuery<NoInfer<Task>> = {
        user: { id: userId },
        createdAt: {
          $lte: endTime,
          $gte: startTime,
        },
      };
      const orderBy: OrderDefinition<Task> = {};

      if (title) Object.assign(where, { title: { $ilike: `${title}%` } });
      if (status) Object.assign(where, { status });
      if (deadline) {
        const { start, end } = TimestampUtil.getStartAndEndOfDate(deadline);
        Object.assign(where, {
          deadline: {
            $lte: end,
            $gte: start,
          },
        });
      }

      for (const key in orderFields) {
        if (orderFields[key])
          Object.assign(orderBy, { [key]: orderFields[key] });
      }

      const results = await this.getPaginate(em, Task, { page, size }, where, {
        orderBy,
      });

      return results;
    } catch (error) {
      this.logger.error(error);
      throw new HttpException(
        error?.message || null,
        error?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    } finally {
      em.clear();
    }
  }

  async createTask(userId: string, payload: ICreateTaskPayload): Promise<Task> {
    const em = this.entityManager.fork();
    try {
      const user = await this.getOne(
        em,
        User,
        { id: userId },
        { exclude: ['token', 'password', 'tokenExpireDate'] },
      );

      if (!user) throw new BadRequestException('Not found user');

      const task: Task = Object.assign(payload, { user });

      const record = await this.insert(em, Task, task);

      return record;
    } catch (error) {
      this.logger.error(error);
      throw new HttpException(
        error?.message || null,
        error?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    } finally {
      em.clear();
    }
  }

  async updateTask(
    userId: string,
    payload: Partial<IUpdateTaskPayload>,
  ): Promise<Task> {
    const em = this.entityManager.fork();
    try {
      const { id, ...rest } = payload;

      let task = await this.getOne(em, Task, { id, user: { id: userId } });
      if (!task) throw new NotFoundException('Not found record');

      task = Object.assign(task, rest);

      await em.flush();

      return task;
    } catch (error) {
      this.logger.error(error);
      throw new HttpException(
        error?.message || null,
        error?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    } finally {
      em.clear();
    }
  }
}
