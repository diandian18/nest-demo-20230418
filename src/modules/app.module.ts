import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import {APP_FILTER, APP_GUARD, APP_INTERCEPTOR, APP_PIPE} from '@nestjs/core';
import {CatController} from './cat/cat.controller.temp';
import { CatModule } from './cat/cat.module';
import {ConfigModule} from './config/config.module';
import {HttpExceptionFilter} from '@/filters/httpException.filter';
import { logger, LoggerMiddleware } from '@/middlewares/logger.middleware';
import {ValidationPipe} from '@/pipes/validation.pipe';
import {PermissionGuard} from '@/guards/permission.guard';
import {redisStore} from 'cache-manager-redis-store';
import { RedisClientOptions } from 'redis';
import {RedisModule} from './redis/redis.module';
import {UserModule} from './user/user.module';
import {LoggingInterceptor} from '@/interceptors/logging.interceptor';
import {TransformInterceptor} from '@/interceptors/transform.interceptor';
import {ExcludeNullInterceptor} from '@/interceptors/excludeNull.interceptor';
import {ErrorsInterceptor} from '@/interceptors/errors.interceptor';
import {CacheInterceptor} from '@/interceptors/cache.interception';
import {TimeoutInterceptor} from '@/interceptors/timeout.interceptor';
import {connection} from '@/customProviders/aExample';
import {CONNECTION} from '@/consts/customProvider';

@Module({
  imports: [ 
    CatModule,
    UserModule,
    ConfigModule.register({ folder: './config' }), 
    RedisModule,
    // CacheModule.register<RedisClientOptions>({
    //   isGlobal: true,
    //   store: redisStore,
    //   host: '127.0.0.1',
    //   port: 6379,
    // }),
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
    },
    {
      provide: APP_GUARD,
      useClass: PermissionGuard,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformInterceptor,
    },
    // {
    //   provide: APP_INTERCEPTOR,
    //   useClass: ExcludeNullInterceptor,
    // },
    {
      provide: APP_INTERCEPTOR,
      useClass: ErrorsInterceptor,
    },
    // {
    //   provide: APP_INTERCEPTOR,
    //   useClass: CacheInterceptor
    // },
    {
      provide: APP_INTERCEPTOR,
      useClass: TimeoutInterceptor,
    }, 
    // Class providers 写法
    /* {
      provide: ConfigService,
      useClass: process.env.NODE_ENV === 'development'
        ? DevConfigService
        : ProdConfigService,
    },*/
    // Factory providers 写法
    /*{
      provide: CONNECTION,
      useFactory(optionsProvider: OptionsProvider, optionalProvider?: string) {
        const options = optionsProvider.get(); 
        return new DatabaseConnection(options);
      },
      inject: [OptionsProvider, { token: 'SomeOptionalProvider', optional: true }],
    },
    OptionsProvider,*/
    // Alias Providers 写法
    /*const loggerAliasProvider = {
      provide: 'AliasedLoggerService',
      useExisting: LoggerService,
    }
    @Moudle({providers: [LoggerService, LoggerAliasProvider]})*/
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(
        LoggerMiddleware,
        logger
      )
      // .forRoutes({ path: 'cat', method: RequestMethod.GET });
      .exclude(
        { path: 'cat', method: RequestMethod.GET },
        'cat/(.*)',
      )
      .forRoutes(CatController);
  }
}

