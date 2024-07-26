import { Task } from '@core/database';
import { ETaskStatus, Sort } from '@core/enums';
import { IQueryTask, OrderFields, QueryFields } from '@core/interfaces';
import { TimestampUtil } from '@core/utils';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDateString,
  IsEnum,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

export class QueryFieldsTaskDto implements QueryFields<Task> {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  title: string;

  @ApiProperty({
    required: false,
    enum: ETaskStatus,
    default: ETaskStatus.NotYet,
  })
  @IsOptional()
  @IsEnum(ETaskStatus)
  status: ETaskStatus;

  @ApiProperty({
    required: false,
    default: TimestampUtil.getCurrentTimestamp().toISOString(),
  })
  @IsOptional()
  @IsDateString()
  deadline: Date;
}
export class OrderFieldsTaskDto implements OrderFields<Task> {
  @ApiProperty({ enum: Sort })
  @IsOptional()
  @IsEnum(Sort)
  createdAt: Sort;

  @ApiProperty({ enum: Sort })
  @IsOptional()
  @IsEnum(Sort)
  status: Sort;

  @ApiProperty({ enum: Sort })
  @IsOptional()
  @IsEnum(Sort)
  deadline: Sort;
}

export class QueryTaskDto implements IQueryTask {
  @ApiProperty({ required: true, type: QueryFieldsTaskDto })
  @IsObject()
  @ValidateNested()
  @Type(() => QueryFieldsTaskDto)
  queryFields: QueryFieldsTaskDto;

  @ApiProperty({ required: true, type: OrderFieldsTaskDto })
  @IsObject()
  @ValidateNested()
  @Type(() => OrderFieldsTaskDto)
  orderFields: OrderFieldsTaskDto;
}
