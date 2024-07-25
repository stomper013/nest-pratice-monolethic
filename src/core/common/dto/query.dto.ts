import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDateString, IsNumber, IsOptional } from 'class-validator';
import moment from 'moment';
import { IPagination, ITimerQuery } from '@core/interfaces/request';

export class PaginateDto implements IPagination {
  @ApiProperty({ required: true, default: 1 })
  @Type(() => Number)
  @IsNumber()
  page: number;

  @ApiProperty({ required: true, default: 20 })
  @Type(() => Number)
  @IsNumber()
  size: number;
}

export class TimerDto extends PaginateDto implements ITimerQuery {
  @ApiProperty({
    required: false,
    default: moment().utc().startOf('date').toISOString(),
  })
  @IsOptional()
  @IsDateString()
  startTime: Date;

  @ApiProperty({
    required: false,
    default: moment().utc().endOf('date').toISOString(),
  })
  @IsOptional()
  @IsDateString()
  endTime: Date;
}
