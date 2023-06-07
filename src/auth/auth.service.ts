import { JwtPayload } from '@/common/types/auth.type';
import { genRedisAccessTokenKey, genRedisRefreshTokenKey, genRedisAuthUserIdKey } from '@/common/utils/auth.util';
import { ConfigService } from '@/config/config.service';
import { UserDto } from '@/user/user.dto';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Cache } from 'cache-manager';

@Injectable()
export class AuthService {
  constructor(
    @Inject(CACHE_MANAGER)
    private cacheManager: Cache,
    private configService: ConfigService,
    private jwtService: JwtService,
  ) {}
  /**
   * 生成和保存accessToken refreshToken expiration
   * replace模式下，会删除该用户的原token，即同时只能有一个token
   */
  async genToken(
    user: UserDto,
    opts?: { replace?: boolean; refreshToken?: string },
  ) {
    const { replace = false } = opts ?? {};
    // 生成jwt
    const jwtPayload: JwtPayload = { ...user, timestamp: Date.now() };
    const accessToken = await this.jwtService.signAsync(jwtPayload);
    const refreshToken = await this.jwtService.signAsync({
      ...jwtPayload,
      isRefreshToken: true,
    });
    const accessTokenTTL = +this.configService.get('JWT_ACCESS_TOKEN_TTL');
    const refreshTokenTTL = +this.configService.get('JWT_REFRESH_TOKEN_TTL');
    const expiration = Date.now() + refreshTokenTTL * 1000;

    // 生成redis键值对
    const redisAccessTokenKey = genRedisAccessTokenKey(accessToken); // key格式: auth:access_token:{accessToken}
    const redisRefreshTokenKey = genRedisRefreshTokenKey(refreshToken);
    const redisTokenValue = user.userId;

    // 保存在redis
    const promises = [
      this.cacheManager.set(
        redisAccessTokenKey,
        redisTokenValue,
        accessTokenTTL, // 不会生效，似乎是bug
      ),
      this.cacheManager.set(
        redisRefreshTokenKey,
        redisTokenValue,
        refreshTokenTTL,
      ),
    ];

    // 如果同时只能有一个accessToken
    if (replace) {
      // 删除原token -> user
      const oldTokenJson = await this.cacheManager.get<string>(
        genRedisAuthUserIdKey(user.userId),
      );
      const {
        accessToken: oldAccessToken,
        refreshToken: oldRefreshToken
      } = JSON.parse(oldTokenJson ?? null) ?? {};

      if (oldAccessToken && oldRefreshToken) {
        promises.push(
          this.cacheManager.del(
            genRedisAccessTokenKey(oldAccessToken)
          ),
          this.cacheManager.del(
            genRedisRefreshTokenKey(oldRefreshToken)
          ),
        );
      }
      // 更新userId -> token
      promises.push(
        this.cacheManager.set(
          genRedisAuthUserIdKey(user.userId),
          JSON.stringify({
            accessToken,
            refreshToken,
          }),
          accessTokenTTL,
        ),
      );
    }

    await Promise.all(promises);

    return {
      accessToken,
      refreshToken,
      expiration,
    };
  }
}
