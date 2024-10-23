import { createParamDecorator, ExecutionContext, BadRequestException } from '@nestjs/common';
import { validate as validateUUID } from 'uuid';

export const UUIDParam = createParamDecorator((data: string, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  const paramValue = request.params[data];

  if (!validateUUID(paramValue)) {
    throw new BadRequestException('Invalid UUID format');
  }

  return paramValue;
});
