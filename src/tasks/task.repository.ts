import { EntityRepository, Repository } from 'typeorm';
import { User } from '../auth/auth.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { Task } from './task.entity';
import { TaskStatus } from './task.types';

@EntityRepository(Task)
export class TaskRepository extends Repository<Task> {
  async getTasks(
    filterOptions: GetTasksFilterDto,
    user: User,
  ): Promise<Task[]> {
    const { status, search } = filterOptions;
    const query = this.createQueryBuilder('task');
    query.where('task.userId = :userId', { userId: user.id });
    if (status) query.andWhere('task.status = :status', { status });
    if (search)
      query.andWhere(
        'task.title LIKE :search OR task.description LIKE :search',
        { search: `%${search}%` },
      );
    const tasks = await query.getMany();
    return tasks;
  }

  async createTask(taskBody: CreateTaskDto, user: User): Promise<Task> {
    const task = new Task();
    task.title = taskBody.title;
    task.description = taskBody.description;
    task.status = TaskStatus.OPEN;
    task.user = user;
    await task.save();
    delete task.user;
    return task;
  }
}
