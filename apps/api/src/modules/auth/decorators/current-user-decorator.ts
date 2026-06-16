import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

const getCurrentUserByContext = (ctx: ExecutionContext) =>
  ctx.switchToHttp().getRequest<Request>().user;

export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext) => getCurrentUserByContext(ctx)
);
