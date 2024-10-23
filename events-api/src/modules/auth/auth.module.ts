import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { DatabaseModule } from '../database/database.module';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthTokenStrategy } from './strategies/auth-token.strategy';

@Module({
  imports: [JwtModule, DatabaseModule, PassportModule],
  providers: [AuthService, AuthTokenStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
