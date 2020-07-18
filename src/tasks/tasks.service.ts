import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../auth/auth.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { Task } from './task.entity';
import { TaskRepository } from './task.repository';
import { TaskStatus } from './task.types';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private taskRepository: TaskRepository,
  ) {}

  async getTasks(
    filterOptions: GetTasksFilterDto,
    user: User,
  ): Promise<Task[]> {
    return await this.taskRepository.getTasks(filterOptions, user);
  }

  async getTaskById(id: Task['id'], user: User): Promise<Task> {
    const task = await this.taskRepository.findOne({
      where: { id, userId: user.id },
    });
    if (!task) throw new NotFoundException(`Task with id '${id}' not found!`);
    return task;
  }

  async createTask(taskBody: CreateTaskDto, user: User): Promise<Task> {
    return this.taskRepository.createTask(taskBody, user);
  }

  async updateTask(
    id: Task['id'],
    status: TaskStatus,
    user: User,
  ): Promise<Task> {
    const task = await this.getTaskById(id, user);
    task.status = status;
    await task.save();
    return task;
  }

  async deleteTask(id: Task['id'], user: User): Promise<void> {
    const result = await this.taskRepository.delete({ id, userId: user.id });
    if (result.affected === 0)
      throw new NotFoundException(`Task with id '${id}' not found!`);
  }
}
