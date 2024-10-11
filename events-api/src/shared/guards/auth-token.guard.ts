import { AuthGuard as PAuthGuard } from '@nestjs/passport';
import { AuthConfig } from '../configs/auth.config';

export class AuthTokenGuard extends PAuthGuard(AuthConfig.AuthTokenKey) {}
