import { BadRequestException, PipeTransform } from '@nestjs/common';
import { TaskStatus } from '../task.types';

export class TaskStatusValidationPipe implements PipeTransform {
  readonly allowedStatuses = [
    TaskStatus.OPEN,
    TaskStatus.IN_PROGRESS,
    TaskStatus.DONE,
  ];

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  transform(value: any) {
    value = String(value).toUpperCase();
    if (!this.isStatusValid(value))
      throw new BadRequestException(
        `Status must be one of the following values: ${TaskStatus.OPEN},${TaskStatus.IN_PROGRESS},${TaskStatus.DONE}`,
      );
    return value;
  }

  private isStatusValid(status: any): boolean {
    return this.allowedStatuses.includes(status);
  }
}
