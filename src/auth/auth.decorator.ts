import { UserRetDto } from '@/user/user.dto';
import { createParamDecorator, ExecutionContext, SetMetadata } from '@nestjs/common';
import { NO_AUTH_REQUIRED_KEY } from './auth.const';

/**
 * 该接口不需要auth
 */
export function Public() {
  return SetMetadata(NO_AUTH_REQUIRED_KEY, true);
}

export const ReqUser = createParamDecorator((_data: unknown, ctx: ExecutionContext): UserRetDto => {
  const request = ctx.switchToHttp().getRequest();
  return request.user;
});

