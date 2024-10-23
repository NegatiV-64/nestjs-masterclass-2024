import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthTokenPayload } from '../types/auth-payload.type';
import { AuthConfig } from 'src/shared/configs/auth.config';
import { EnvConfig } from 'src/shared/configs/env.config';

@Injectable()
export class AuthTokenStrategy extends PassportStrategy(Strategy, AuthConfig.AuthTokenKey) {
  constructor(private configService: ConfigService<EnvConfig, true>) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get<string>('AUTH_TOKEN_SECRET'),
    });
  }

  public async validate({ sub, userEmail, userRole }: AuthTokenPayload) {
    /**
     * Here you can perform additional checks to validate the user
     * For example, you can check if the user exists in the database
     * Or call an external service to validate the user (e.g. oAuth for Google, Facebook, etc.)
     * For demonstration purposes, we will just return the user ID and email
     * But in a real-world application, you should perform additional checks
     */

    return {
      userId: sub,
      userEmail,
      userRole: userRole,
    };
  }
}
