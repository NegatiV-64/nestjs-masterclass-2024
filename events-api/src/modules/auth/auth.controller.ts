import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { RegisterDto } from './dto/requests/register.dto';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/requests/login.dto';

@ApiTags('Authentication') // Grouping the endpoints under "Authentication" in Swagger
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new user' }) // Describes the endpoint
  @ApiResponse({ status: 201, description: 'User successfully registered' }) // Success response
  @ApiResponse({ status: 400, description: 'Validation failed or user already exists' }) // Error response
  async register(@Body() registerDto: RegisterDto) {
    const createdUser = await this.authService.register(registerDto);

    return {
      message: 'User created',
      data: createdUser,
    };
  }

  @Post('login')
  @ApiOperation({ summary: 'Login a user' }) // Describes the login operation
  @ApiResponse({ status: 200, description: 'User successfully logged in' }) // Success response
  @ApiResponse({ status: 401, description: 'Invalid credentials' }) // Error response for failed login
  async login(@Body() loginDto: LoginDto) {
    const authData = await this.authService.login(loginDto);

    return {
      message: 'User logged in',
      data: authData,
    };
  }
}
