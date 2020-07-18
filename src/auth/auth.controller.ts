import { Body, Controller, Post, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/register')
  async register(
    @Body(ValidationPipe) authCredentials: AuthCredentialsDto,
  ): Promise<void> {
    return this.authService.register(authCredentials);
  }

  @Post('/login')
  async login(
    @Body(ValidationPipe) authCredentials: Omit<AuthCredentialsDto, 'username'>,
  ): Promise<{ accessToken: string }> {
    return this.authService.login(authCredentials);
  }
}
