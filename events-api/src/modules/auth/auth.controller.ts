import { Body, Controller, Post } from '@nestjs/common';
import { RegisterDto } from './dto/requests/register.dto';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/requests/login.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({summary: "New user registration"})
  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    const createdUser = await this.authService.register(registerDto);

    return {
      message: 'User created',
      data: createdUser,
    };
  }

  @ApiOperation({summary: "User log in"})
  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    const authData = await this.authService.login(loginDto);

    return {
      message: 'User logged in',
      data: authData,
    };
  }
}
