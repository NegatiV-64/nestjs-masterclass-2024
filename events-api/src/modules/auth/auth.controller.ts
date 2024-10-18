import { Body, Controller, Post } from '@nestjs/common';
import { RegisterDto } from './dto/requests/register.dto';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/requests/login.dto';
import { ApiBadRequestResponse, ApiBody, ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { LoginResponseDto } from './dto/responses/login-response.dto';
import { RegisterResponseDto } from './dto/responses/register-response.dto';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Create a new user' })
  @ApiCreatedResponse({ description: 'User created successfully', type: RegisterResponseDto })
  @ApiBadRequestResponse({ description: 'Invalid request body provided' })
  async register(@Body() registerDto: RegisterDto) {
    const createdUser = await this.authService.register(registerDto);

    return {
      message: 'User created',
      data: createdUser,
    };
  }

  @Post('login')
  @ApiOperation({ summary: 'Log in a user' })
  @ApiCreatedResponse({ description: 'Logged in successfully', type: LoginResponseDto })
  @ApiBadRequestResponse({ description: 'Invalid request body provided' })
  async login(@Body() loginDto: LoginDto) {
    const authData = await this.authService.login(loginDto);

    return {
      message: 'User logged in',
      data: authData,
    };
  }
}
