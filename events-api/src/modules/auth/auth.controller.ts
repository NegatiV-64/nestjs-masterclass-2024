import { Body, Controller, Post } from '@nestjs/common';
import { RegisterDto } from './dto/requests/register.dto';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/requests/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    const createdUser = await this.authService.register(registerDto);

    return {
      message: 'User created',
      data: createdUser,
    };
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    const authData = await this.authService.login(loginDto);

    return {
      message: 'User logged in',
      data: authData,
    };
  }
}
