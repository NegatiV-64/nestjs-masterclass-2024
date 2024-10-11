import { BadRequestException, Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { EnvConfig } from 'src/shared/configs/env.config';
import { RegisterDto } from './dto/requests/register.dto';
import { Hasher } from 'src/shared/libs/hasher.lib';
import { LoginDto } from './dto/requests/login.dto';
import { AuthTokenPayload } from './types/auth-payload.type';
import { UserRole } from 'src/shared/constants/user-role.constant';

@Injectable()
export class AuthService {
  constructor(
    private readonly databaseService: DatabaseService,
    private configService: ConfigService<EnvConfig, true>,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    const email = registerDto.email;
    const password = await Hasher.hashValue(registerDto.password);

    const existingUser = await this.databaseService.user.findUnique({
      where: {
        userEmail: email,
      },
    });
    if (existingUser) {
      throw new BadRequestException('Email already exists in the system');
    }

    const user = await this.databaseService.user.create({
      data: {
        userEmail: email,
        userPassword: password,
      },
    });

    const authToken = await this.generateAuthToken({
      sub: user.userId,
      userEmail: user.userEmail,
      userRole: user.userRole as UserRole,
    });

    return {
      authToken,
    };
  }

  async login({ email, password }: LoginDto) {
    const user = await this.databaseService.user.findUnique({
      where: {
        userEmail: email,
      },
    });

    if (!user) {
      throw new BadRequestException('Invalid email or password');
    }

    const isPasswordValid = await Hasher.verifyHash(user.userPassword, password);
    if (!isPasswordValid) {
      throw new BadRequestException('Invalid email or password');
    }

    const payload = {
      sub: user.userId,
      userEmail: user.userEmail,
      userRole: user.userRole as UserRole,
    };
    const authToken = await this.generateAuthToken(payload);

    return {
      authToken,
    };
  }

  async generateAuthToken(payload: AuthTokenPayload) {
    const secret = this.configService.get('AUTH_TOKEN_SECRET', {
      infer: true,
    });
    const expiresIn = this.configService.get('AUTH_TOKEN_EXPIRES_IN', {
      infer: true,
    });

    const authToken = await this.jwtService.signAsync(payload, {
      secret,
      expiresIn,
    });

    return authToken;
  }
}
