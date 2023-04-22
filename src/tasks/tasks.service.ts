import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, Repository } from 'typeorm';

import { CreateTaskDto } from './dto/create-task.dto';
import { TaskQuerySearchParams } from './types/task-query-search-params.type';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task } from './entities/task.entity';
import { TaskNotFoundException } from './exceptions/task-not-found.exception';
import { User } from '../users/entities/user.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task) private readonly tasksRepository: Repository<Task>,
  ) {}

  async findAll(userId: number, query: TaskQuerySearchParams) {
    const { limit, offset, isComplete } = query;

    const where: FindManyOptions<Task>['where'] = { userId, isComplete };

    const order: Record<string, { direction: string }> = {};

    if (query.orderBy) {
      const orders = query.orderBy.split('_');
      const column = orders[0];
      const direction = orders[1];
      order[column] = { direction };
    }

    const [items, count] = await this.tasksRepository.findAndCount({
      where,
      order,
      skip: offset,
      take: limit,
    });

    return { count, items };
  }

  async create(createTaskDto: CreateTaskDto, user: User) {
    const task = this.tasksRepository.create({
      ...createTaskDto,
      userId: user.id,
    });
    await this.tasksRepository.save(task);
    return task;
  }

  async findOne(id: number) {
    const task = await this.tasksRepository.findOneBy({ id });
    return task;
  }

  async update(taskId: number, updateTaskDto: UpdateTaskDto, userId: number) {
    const task = await this.tasksRepository.update(
      { id: taskId, userId },
      updateTaskDto,
    );
    if (!task.affected) throw new TaskNotFoundException(taskId);
  }

  async remove(id: number, userId: number) {
    const deleteResponse = await this.tasksRepository.delete({ id, userId });
    if (!deleteResponse.affected) throw new TaskNotFoundException(id);
  }
}

export default TasksService;
