import { IsNotEmpty } from 'class-validator';

export class CreateTaskDto {
  @IsNotEmpty({
    message: 'Title should not be empty!',
  })
  title: string;

  @IsNotEmpty({
    message: 'Description should not be empty!',
  })
  description: string;
}
