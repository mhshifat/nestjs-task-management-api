import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtPayload } from 'dist/src/auth/auth.types';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { User } from './auth.entity';
import { AuthRepository } from './auth.repository';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(AuthRepository)
    private authRepository: AuthRepository,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: 'super-secret-token',
    });
  }

  async validate(payload: JwtPayload): Promise<User> {
    const { email } = payload;
    const user = await this.authRepository.findOne({ email });
    if (!user) throw new UnauthorizedException();
    return user;
  }
}
