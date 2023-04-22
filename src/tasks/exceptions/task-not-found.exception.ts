import { NotFoundException } from '@nestjs/common';

export class TaskNotFoundException extends NotFoundException {
  constructor(taskId: number) {
    super(`Could not find task with id: ${taskId}.`);
  }
}

export default TaskNotFoundException;
