import { TimerDto, UserDecorator } from '@core/common';
import { IJwtPayload } from '@core/interfaces';
import { JwtGuard } from '@core/middlewares';
import {
  Body,
  Controller,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CreateTaskDto, QueryTaskDto, UpdateTaskDto } from './dto';
import { TaskService } from './task.service';

@Controller('task')
@ApiTags('Task')
@ApiBearerAuth()
@UseGuards(JwtGuard)
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post('error')
  async getError(): Promise<void> {
    return this.taskService.getError();
  }

  @Post('list')
  async getTasksByUserId(
    @UserDecorator() user: IJwtPayload,
    @Query() query: TimerDto,
    @Body() body: QueryTaskDto,
  ) {
    const { userId } = user;
    const queryTask = Object.assign(body, query);

    return this.taskService.getTasksByUserId(userId, queryTask);
  }

  @Post('create')
  async createTask(
    @UserDecorator() user: IJwtPayload,
    @Body() body: CreateTaskDto,
  ) {
    const { userId } = user;

    return this.taskService.createTask(userId, body);
  }

  @Post('update/:id')
  async updateTask(
    @UserDecorator() user: IJwtPayload,
    @Param('id') id: string,
    @Body() body: UpdateTaskDto,
  ) {
    const { userId } = user;
    const payload = Object.assign(body, { id });

    return this.taskService.updateTask(userId, payload);
  }
}
