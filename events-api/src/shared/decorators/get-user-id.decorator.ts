import { createParamDecorator, ExecutionContext, UnauthorizedException } from '@nestjs/common';

export const UserId = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const userId = request.user?.userId;

    if (!userId) {
      throw new UnauthorizedException('User not authenticated')
    }

    return userId
  },
);
