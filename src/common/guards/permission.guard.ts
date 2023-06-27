import { Permission } from '@/common/enums/permission';
import StatusCodeEnum from '@/common/enums/StatusCodeEnum';
import genResponse from '@/common/utils/genResponse';
import { CanActivate, ExecutionContext, ForbiddenException, Injectable, Logger } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PERMISSION_KEY } from '../consts/permission.const';

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private logger: Logger,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // 通过reflector获取getMetaData，还有一个getAllAndMerge，结果: ['user', 'admin']
    const permissions = this.reflector.getAllAndOverride<Permission[]>(
      PERMISSION_KEY,
      [
        // @Permission写在成员方法
        context.getHandler(),
        // @Permission写在类上
        context.getClass(),
      ],
    );

    // 如果设置了权限，并且用户权限不匹配，则报错403
    this.logger.log(`Permissions range: ${permissions ?? '[]'}`, PermissionGuard.name);
    if (permissions && false) {
      throw new ForbiddenException(
        genResponse.fail(StatusCodeEnum.JWT_TOKEN_IS_FORBIDDEN),
      );
    }
    return true;
  }
}
