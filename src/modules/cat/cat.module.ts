import { Global, Module } from '@nestjs/common';
import CatsService from './cat.service';
import { CatController } from './cat.controller';
import {CacheModule} from '@nestjs/cache-manager';
import {redisStore} from 'cache-manager-redis-store';
import {RedisClientOptions} from 'redis';
import {CONNECTION} from '@/consts/customProvider';
import {connection} from '@/customProviders/aExample';

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
  providers: [
    CatsService,
    // 自定义provider，provider可以写字符串，useValue可以是任意...?
    // 要注入此依赖，可在service的constructor中@inject('CONNECTION') connection: Connection
    {
      provide: CONNECTION,
      useValue: connection,
    },
  ],
  exports: [CatsService],
})
export class CatModule {}
