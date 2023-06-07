import { CacheModule } from '@nestjs/cache-manager';
import { Global, Module } from '@nestjs/common';
import { redisStore } from 'cache-manager-redis-store';
import { RedisService } from './redis.service';
import { RedisClientOptions } from 'redis';
import { ConfigService } from '@/config/config.service';

@Global()
@Module({
  imports: [
    CacheModule.registerAsync<RedisClientOptions>({
      // imports: [ConfigModule],
      inject: [ConfigService],
      // @ts-ignore
      useFactory: async (configService: ConfigService) => ({
        // store: await redisStore({
        //   url: configService.get('REDIS_URL'),
        //   password: configService.get('REDIS_PASS'),
        //   // ttl: +configService.get('REDIS_TTL'),
        // }),
        store: redisStore,
        url: configService.get('REDIS_URL'),
        password: configService.get('REDIS_PASS'),
        // ttl: 3,
      }),
    }),
  ],
  providers: [RedisService],
  exports: [RedisService],
})
export class RedisModule {}
