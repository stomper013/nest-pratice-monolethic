import { ETaskStatus } from '@core/enums';
import { ICreateTaskPayload, IUpdateTaskPayload } from '@core/interfaces';
import { TimestampUtil } from '@core/utils';
import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsDateString, IsEnum, IsNotEmpty, IsString } from 'class-validator';

export class CreateTaskDto implements ICreateTaskPayload {
  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty({
    required: true,
    default: TimestampUtil.getCurrentTimestamp().toISOString(),
  })
  @IsDateString()
  deadline: Date;
}

export class UpdateTaskDto
  extends PartialType(CreateTaskDto)
  implements Partial<IUpdateTaskPayload>
{
  @ApiProperty({
    required: false,
    enum: ETaskStatus,
    default: ETaskStatus.NotYet,
  })
  @IsEnum(ETaskStatus)
  status: ETaskStatus;
}
