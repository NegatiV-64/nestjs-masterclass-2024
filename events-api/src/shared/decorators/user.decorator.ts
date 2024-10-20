import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { AuthUserPayload } from '../types/auth-user-payload.type';
import { ObjectValues } from '../types/utility.type';

export const User = createParamDecorator((data: string, ctx: ExecutionContext): AuthUserPayload | ObjectValues<AuthUserPayload> => {
  const request = ctx.switchToHttp().getRequest();
  const user = request.user;

  return data ? user?.[data] : user;
});
