import {createParamDecorator, ExecutionContext} from "@nestjs/common";
import {Request} from "express";

export const User = createParamDecorator((data: string, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest<Request>();
  // const user = request.user;
  const query = request.query;

  return data ? query?.[data] : query;
});

