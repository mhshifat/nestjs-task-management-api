import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtPayload } from '../../dist/src/auth/auth.types';
import { AuthRepository } from './auth.repository';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(AuthRepository)
    private authRepository: AuthRepository,
    private jwtService: JwtService,
  ) {}

  async register(authCredentials: AuthCredentialsDto): Promise<void> {
    return this.authRepository.register(authCredentials);
  }

  async login(
    authCredentials: Omit<AuthCredentialsDto, 'username'>,
  ): Promise<{ accessToken: string }> {
    const { email, password } = authCredentials;
    const user = await this.authRepository.findOne({ email });
    const isRequestValid = user && (await user.isPasswordValid(password));
    if (!user || !isRequestValid)
      throw new UnauthorizedException('Invalid credentials');
    const payload: JwtPayload = { email, username: user.username };
    const token: string = this.jwtService.sign(payload);
    return { accessToken: token };
  }
}
