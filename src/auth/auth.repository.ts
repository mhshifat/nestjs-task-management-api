import {
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { hash } from 'bcryptjs';
import { EntityRepository, Repository } from 'typeorm';
import { User } from './auth.entity';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';

@EntityRepository(User)
export class AuthRepository extends Repository<User> {
  async register(authCredentials: AuthCredentialsDto): Promise<void> {
    const { username, email, password } = authCredentials;
    const user = new User();
    user.username = username;
    user.email = email;
    user.password = await this.hashPassword(password);

    try {
      await user.save();
    } catch (err) {
      if (err.code === '23505' && err.detail.includes('username'))
        throw new ConflictException('Username already exist');
      else if (err.code === '23505' && err.detail.includes('email'))
        throw new ConflictException('Email already exist');
      else throw new InternalServerErrorException();
    }
  }

  async hashPassword(password: User['password']): Promise<User['password']> {
    return hash(password, 10);
  }
}
