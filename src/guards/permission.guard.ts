import {Permission} from "@/enums/permission";
import StatusCodeEnum from "@/enums/StatusCodeEnum";
import genResponse from "@/utils/genResponse";
import {CanActivate, ExecutionContext, ForbiddenException, Injectable, UnauthorizedException} from "@nestjs/common";
import {Reflector} from "@nestjs/core";
import {Observable} from "rxjs";
import {PERMISSION_KEY} from "./permission.decorator";

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    // 通过reflector获取getMetaData，还有一个getAllAndMerge，结果: ['user', 'admin']
    const permissions = this.reflector.getAllAndOverride<Permission[]>(PERMISSION_KEY, [
      // @Permission写在成员方法
      context.getHandler(),
      // @Permission写在类上
      context.getClass(),
    ]);
 
    console.log('[PermissionGuard] permissions: ', permissions);

    if (!permissions) {
      return true;
    }

    // 获取请求头
    const { headers = {} } = context.switchToHttp().getRequest();
    const { authorization } = headers;
    console.log('[PermissionGuard] authorization: ', authorization);

    // 判断token这个一般逻辑在 网关层(gateway) 做
    if (authorization) {
      // 在这里根据 token解析出来的permission 和 接口声明的permission 匹配判断返回true/false
      if (Math.random() > 0.5) {
        throw new ForbiddenException(genResponse.fail(StatusCodeEnum.JWT_TOKEN_IS_FORBIDDEN));
      } else {
        return true;
      }
    } else {
      throw new UnauthorizedException(genResponse.fail(StatusCodeEnum.UNAUTHORIZED));
    }
    // return permissions.some();
  }
}

