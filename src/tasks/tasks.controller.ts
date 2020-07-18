import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { User } from '../auth/auth.entity';
import { GetUser } from '../auth/get-user.decorator';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { TaskStatusValidationPipe } from './pipes/task-status-validation.pipe';
import { Task } from './task.entity';
import { TaskStatus } from './task.types';
import { TasksService } from './tasks.service';

@Controller('tasks')
@UseGuards(AuthGuard())
export class TasksController {
  constructor(private tasksService: TasksService) {}

  @Get()
  async getTasks(
    @Query(ValidationPipe) filterOptions: GetTasksFilterDto,
    @GetUser() user: User,
  ): Promise<Task[]> {
    return await this.tasksService.getTasks(filterOptions, user);
  }

  @Post()
  async createTask(
    @Body('title') title: Task['title'],
    @Body('description') description: Task['description'],
    @GetUser() user: User,
  ): Promise<Task> {
    return await this.tasksService.createTask({ title, description }, user);
  }

  @Get('/:id')
  async getTask(
    @Param('id', ParseIntPipe) id: Task['id'],
    @GetUser() user: User,
  ): Promise<Task> {
    return await this.tasksService.getTaskById(id, user);
  }

  @Patch('/:id')
  async updateTask(
    @Param('id', ParseIntPipe) id: Task['id'],
    @Body('status', TaskStatusValidationPipe) status: TaskStatus,
    @GetUser() user: User,
  ): Promise<Task> {
    return await this.tasksService.updateTask(id, status, user);
  }

  @Delete('/:id')
  async deleteTask(
    @Param('id', ParseIntPipe) id: Task['id'],
    @GetUser() user: User,
  ): Promise<void> {
    return await this.tasksService.deleteTask(id, user);
  }
}
