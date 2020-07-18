import { compare } from 'bcryptjs';
import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { Task } from '../tasks/task.entity';

@Entity()
@Unique(['username'])
@Unique(['email'])
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @OneToMany(
    () => Task,
    task => task.user,
    { eager: true },
  )
  tasks: Task[];

  async isPasswordValid(password: User['password']): Promise<boolean> {
    return compare(password, this.password);
  }
}
