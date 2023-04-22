import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  UseGuards,
  Req,
  Query,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { CreateTaskDto } from './dto/create-task.dto';
import { TaskQuerySearchParams } from './types/task-query-search-params.type';
import { TasksService } from './tasks.service';
import { UpdateTaskDto } from './dto/update-task.dto';
import { JwtAuthenticationGuard } from '../auth/guards/jwt-authentication.guard';
import { RequestWithUser } from '../auth/types/request-with-user.type';
import { Task } from './entities/task.entity';
import { TaskNotFoundException } from './exceptions/task-not-found.exception';

@Controller('tasks')
@ApiTags('tasks')
@ApiBearerAuth('access-token')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  @UseGuards(JwtAuthenticationGuard)
  @ApiOperation({ summary: 'create a user with customer role' })
  async findAll(
    @Query() query: TaskQuerySearchParams,
    @Req() request: RequestWithUser,
  ) {
    return this.tasksService.findAll(request.user.id, query);
  }

  @Get(':id')
  @ApiParam({
    name: 'id',
    required: true,
    description: 'Task id.',
    type: Number,
  })
  @ApiResponse({
    status: 200,
    description: 'Fetched task successfully.',
    type: Task,
  })
  @ApiResponse({
    status: 404,
    description: 'Could not find a task with this id.',
  })
  @UseGuards(JwtAuthenticationGuard)
  async findOne(
    @Param('id', ParseIntPipe) id: number,
    @Req() request: RequestWithUser,
  ) {
    const task = await this.tasksService.findOne(id);
    if (!task || task.userId !== request.user.id)
      throw new TaskNotFoundException(id);
    return task;
  }

  @Post()
  @UseGuards(JwtAuthenticationGuard)
  create(
    @Body() createTaskDto: CreateTaskDto,
    @Req() request: RequestWithUser,
  ) {
    return this.tasksService.create(createTaskDto, request.user);
  }

  @Patch(':id')
  @UseGuards(JwtAuthenticationGuard)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTaskDto: UpdateTaskDto,
    @Req() request: RequestWithUser,
  ) {
    return this.tasksService.update(id, updateTaskDto, request.user.id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthenticationGuard)
  remove(
    @Param('id', ParseIntPipe) id: number,
    @Req() request: RequestWithUser,
  ) {
    return this.tasksService.remove(id, request.user.id);
  }
}

export default TasksController;
