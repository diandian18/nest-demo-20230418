import {CacheModule} from '@nestjs/cache-manager';
import { Global, Module } from '@nestjs/common';
import {redisStore} from 'cache-manager-redis-store';
import {ConfigModule} from '../config/config.module';
import { RedisService } from './redis.service';
import {RedisClientOptions} from 'redis';

@Global()
@Module({
  imports: [
    CacheModule.registerAsync<RedisClientOptions>({
      // imports: [ConfigModule],
      // inject: [ConfigModule],
      // @ts-ignore
      useFactory: async() => ({
        store: await redisStore({
          url: 'redis://127.0.0.1:6379',
          ttl: 60,
        }),
        // store: redisStore,
      }),
    }),
  ],
  providers: [RedisService],
  exports: [RedisService],
})
export class RedisModule {}
