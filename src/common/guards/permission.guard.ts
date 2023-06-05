import { Permission } from '@/common/enums/permission';
import StatusCodeEnum from '@/common/enums/StatusCodeEnum';
import genResponse from '@/common/utils/genResponse';
import { ConfigService } from '@/config/config.service';
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';
import { PERMISSION_KEY } from './permission.decorator';

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private jwtService: JwtService,
    private configService: ConfigService,
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

    console.log('[PermissionGuard] permissions: ', permissions);

    if (!permissions) {
      return true;
    }

    // 获取请求头
    const request = context.switchToHttp().getRequest<Request>();
    const token = this.extractTokenFromHeader(request);
    console.log('[PermissionGuard] token: ', token);

    // 判断token这个一般逻辑在 网关层(gateway) 做
    if (!token) {
      throw new UnauthorizedException(
        genResponse.fail(StatusCodeEnum.UNAUTHORIZED),
      );
    }

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.configService.get('JWT_SECRET'),
      });
      console.log('payload: ', payload);
    } catch (err) {
      throw new UnauthorizedException(
        genResponse.fail(StatusCodeEnum.UNAUTHORIZED),
      );
    }

    // 在这里根据 token解析出来的permission 和 接口声明的permission 匹配判断返回true/false
    // if (Math.random() > 0.5) {
    //   throw new ForbiddenException(genResponse.fail(StatusCodeEnum.JWT_TOKEN_IS_FORBIDDEN));
    // } else {
    //   return true;
    // }
    return true;
  }

  private extractTokenFromHeader(request: Request) {
    // @ts-ignore
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : null;
  }
}
