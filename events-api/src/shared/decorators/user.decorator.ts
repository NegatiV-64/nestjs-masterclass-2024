import { createParamDecorator, ExecutionContext } from "@nestjs/common";

export const User = createParamDecorator(
    (_data: unknown, ctx: ExecutionContext) => {
        console.log(ctx.switchToHttp().getRequest().user);

        return ctx.switchToHttp().getRequest().user;
    }
);
