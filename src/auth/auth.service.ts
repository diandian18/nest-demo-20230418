import { JwtPayload } from './auth.type';
import { genRedisAccessTokenKey, genRedisRefreshTokenKey, genRedisAuthUserIdKey } from './auth.util';
import { ConfigService } from '@/config/config.service';
import { UserRetDto } from '@/user/user.dto';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Cache } from 'cache-manager';

/**
 * 提供了token在redis的增删改查能力
 */
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
   *
   * 保存的时候, accessToken和refreshToken分别都存
   * auth:access_token:${accessToken} -> user 
   * auth:refresh_token:${refreshToken} -> user
   * 如果是replace模式，还额外保存:
   * auth:userId:{userId} -> { accessToken, refreshToken }
   */
  async genToken(
    user: UserRetDto,
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
    const redisTokenValue = JSON.stringify(user);

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
      const {
        accessToken: oldAccessToken,
        refreshToken: oldRefreshToken,
      } = await this.getTokenByUserIdInRedis(user.userId);

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

  /**
   * 通过 accessToken 获取 redis 保存的user信息
   * auth:access_token:${accessToken} -> user
   */
  async getUserRetDtoByAccessTokenInRedis(accessToken: string): Promise<UserRetDto> {
    const userRetDto = await this.cacheManager.get<string>(
      genRedisAccessTokenKey(accessToken),
    );
    return JSON.parse(userRetDto ?? null) ?? {};
  }

  /**
   * 通过 refreshToken 获取 redis 保存的user信息
   * auth:refresh_token:${refreshToken} -> user
   */
  async getUserRetDtoByRefreshTokenInRedis(refreshToken: string): Promise<UserRetDto> {
    const userRetDto = await this.cacheManager.get<string>(
      genRedisRefreshTokenKey(refreshToken)
    );
    return JSON.parse(userRetDto ?? null) ?? {};
  }

  /**
   * 通过 userId 获取redis保存的 token 信息
   * auth:userId:{userId} -> { accessToken, refreshToken }
   */
  async getTokenByUserIdInRedis(userId: number): Promise<{
    accessToken: string;
    refreshToken: string;
  }> {
    const tokenJson = await this.cacheManager.get<string>(
      genRedisAuthUserIdKey(userId),
    )
    const {
      accessToken = null,
      refreshToken = null,
    } = JSON.parse(tokenJson ?? null) ?? {};
    return {
      accessToken,
      refreshToken,
    };
  }
}
