import { Task } from '@core/database';
import { ETaskStatus } from '@core/enums';
import { ITimerQuery, OrderFields, QueryFields } from '../request';

export interface IQueryTask extends ITimerQuery {
  queryFields: QueryFields<Task>;
  orderFields: OrderFields<Task>;
}

export interface ICreateTaskPayload {
  title: string;
  description: string;
  deadline: Date;
}

export interface IUpdateTaskPayload {
  id: string;
  title: string;
  description: string;
  deadline: Date;
  status: ETaskStatus;
}
