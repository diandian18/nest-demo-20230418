import { Global, Module } from '@nestjs/common';
import CatsService from './cat.service';
import { CatController } from './cat.controller';
import {CacheModule} from '@nestjs/cache-manager';
import {redisStore} from 'cache-manager-redis-store';
import {RedisClientOptions} from 'redis';

// @Global()
@Module({
  // imports: [
  //   CacheModule.register<RedisClientOptions>({
  //     store: redisStore,
  //     host: '127.0.0.1',
  //     port: 6379,
  //   }),
  // ],
  controllers: [CatController],
  providers: [CatsService],
  exports: [CatsService],
})
export class CatModule {}
