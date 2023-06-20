import StatusCodeEnum from '@/common/enums/StatusCodeEnum';
import genResponse from '@/common/utils/genResponse';
import { CanActivate, ExecutionContext, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { NO_AUTH_REQUIRED_KEY } from './auth.const';
import { AuthService } from './auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private logger: Logger,
    private authService: AuthService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // 如果是白名单接口，则直接通过
    const noAuthRequired = this.reflector.getAllAndOverride<boolean>(
      NO_AUTH_REQUIRED_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (noAuthRequired) {
      return true;
    }

    // 获取请求头
    const request = context.switchToHttp().getRequest<Request>();
    const accessToken = this.extractTokenFromHeader(request);
    this.logger.log(`[AuthGuard] accessToken:${accessToken}`);

    // 判断token这个一般逻辑在 网关层(gateway) 做
    if (!accessToken) {
      throw new UnauthorizedException(
        genResponse.fail(StatusCodeEnum.UNAUTHORIZED),
      );
    }

    try {
      // 其实可以不用这个jwt库，自己生成一个token存redis也可以
      // const payload = await this.jwtService.verifyAsync<JwtPayload>(token, {
      //   secret: this.configService.get('JWT_SECRET'),
      // });
      // const { userId } = payload;

      const userRetDto = await this.authService.getUserRetDtoByAccessTokenInRedis(accessToken);

      // redis没token则登录失效
      if (!userRetDto) {
        this.logger.log('redis查无此token，登录失效');
        throw new UnauthorizedException(
          genResponse.fail(StatusCodeEnum.UNAUTHORIZED),
        );
      }

      // 放到request里，请求都能拿到user
      request['user'] = userRetDto;
    } catch (err) {
      this.logger.error(err);
      throw new UnauthorizedException(
        genResponse.fail(StatusCodeEnum.UNAUTHORIZED),
      );
    }

    return true;
  }

  private extractTokenFromHeader(request: Request) {
    // @ts-ignore
    const [type, token = ''] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? (token as string).trim() : null;
  }
}
