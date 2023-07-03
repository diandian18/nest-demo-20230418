import { Controller, Get, Logger, MiddlewareConsumer, Module, NestModule, OnApplicationShutdown, OnModuleInit, RequestMethod } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import {APP_FILTER, APP_GUARD, APP_INTERCEPTOR, APP_PIPE} from '@nestjs/core';
import {CatController} from './cat/cat.controller.temp';
import { CatModule } from './cat/cat.module';
import {ConfigModule as CustomConfigModule} from './config/config.module';
import {ConfigService} from '@/config/config.service';
import {HttpExceptionFilter} from '@/common/filters/httpException.filter';
import { logger, LoggerMiddleware } from '@/common/middlewares/logger.middleware';
import {ValidationPipe} from '@/common/pipes/validation.pipe';
import {PermissionGuard} from '@/common/guards/permission.guard';
import {redisStore} from 'cache-manager-redis-store';
// import { redisStore } from 'cache-manager-redis-yet';
// import { redisStore } from 'cache-manager-ioredis-yet';
import { RedisClientOptions } from 'redis';
// import {RedisModule} from '@/redis/redis.module';
import {UserModule} from '@/user/user.module';
// import {LoggingInterceptor} from '@/common/interceptors/logging.interceptor';
import {TransformInterceptor} from '@/common/interceptors/transform.interceptor';
// import {ExcludeNullInterceptor} from '@/common/interceptors/excludeNull.interceptor';
import {ErrorsInterceptor} from '@/common/interceptors/errors.interceptor';
// import {CacheInterceptor} from '@/common/interceptors/cache.interception';
import {TimeoutInterceptor} from '@/common/interceptors/timeout.interceptor';
// import {connection} from '@/common/customProviders/aExample';
// import {CONNECTION} from '@/common/consts/customProvider';
// import {TypeOrmModule} from '@nestjs/typeorm';
// import {User} from './user/user.entity';
import {SequelizeModule} from '@nestjs/sequelize';
import { HttpModule } from '@/http/http.module';
// import {WinstonModule} from 'nest-winston';
import {AllExceptionsFilter} from './common/filters/allExceptions.filter';
import {ResponseInterceptor} from './common/interceptors/response.interceptor';
import {JwtModule} from '@nestjs/jwt';
import { AuthGuard } from '@/auth/auth.guard';
import { AuthModule } from '@/auth/auth.module';
import { RoleModule } from './role/role.module';
import { TenantModule } from './tenant/tenant.module';
import { PermissionModule } from './permission/permission.module';

@Controller('/')
export class AppController {
  constructor(private readonly configService: ConfigService) {}
  @Get('test')
  testConfigService() {
    console.log(this.configService.get('REDIS_PASS'));
  }
}

@Module({
  imports: [
    CatModule,
    UserModule,
    // 自定义的ConfigModule
    CustomConfigModule.register({
      folder: './config',
      isGlobal: true, // isGlobal不会被@Inject
    }),
    // ConfigModule.forRoot({
    //   envFilePath: ''
    // }),
    // 内置ConfigModule
    // ConfigModule.customFuncName({ folder: './config' }),
    /*ConfigModule.registerAsync({
      // ????
      useClass: ConfigModuleOptionsFactory, // <-- this class must provide the "createConfigOptions" method
    }),*/
    // 或者
    // ConfigModule.registerAsync({
    //   useFactory: () => {
    //     return {
    //       folder: './config',
    //     };
    //   },
    //   inject: [...any extra dependencies],
    // }),
    // RedisModule,
    // CacheModule.register<RedisClientOptions>({
    //   isGlobal: true,
    //   store: redisStore,
    //   host: '127.0.0.1',
    //   port: 6379,
    // },
    CacheModule.registerAsync<RedisClientOptions>({
      isGlobal: true,
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
        ttl: 7200,
      }),
    }),

    // mysql DataSource和EntityManager可在整个项目注入
    // TypeOrmModule.forRoot({
    //   type: 'mysql',
    //   host: 'localhost',
    //   port: 3306,
    //   username: 'root',
    //   password: '',
    //   database: 'test_nest',
    //   // entities: [
    //   //   User,
    //   // ],
    //   autoLoadEntities: true, // 指定该选项后，通过 forFeature() 方法注册的每个实体都将自动添加到配置对象的实体数组中，就不用写上面的entities了
    //   synchronize: true,
    // }),

    // 使用config配置
    // TypeOrmModule.forRootAsync({
    //   imports: [ConfigModule],
    //   inject: [ConfigService],
    //   useFactory: (configService: ConfigService) => {
    //     return {
    //       type: 'mysql',
    //       host: configService.get('MYSQL_HOST'),
    //       port: +configService.get('MYSQL_PORT'),
    //       username: configService.get('MYSQL_USERNAME'),
    //       password: configService.get('MYSQL_PASSWORD'),
    //       database: configService.get('MYSQL_DATABASE'),
    //       autoLoadEntities: true,
    //       synchronize: true,
    //     };
    //   }
    // }),
 
    // 设置完后，可以在所有地方注入Sequelize
    SequelizeModule.forRootAsync({
      // imports: [CustomConfigModule],
      inject: [ConfigService],
      useFactory(configService: ConfigService) {
        return {
          dialect: 'mysql',
          host: configService.get('MYSQL_HOST'),
          port: +configService.get('MYSQL_PORT'),
          username: configService.get('MYSQL_USERNAME'),
          password: configService.get('MYSQL_PASSWORD'),
          database: configService.get('MYSQL_DATABASE'),
          // models: [],
          autoLoadModels: true,
          synchronize: false,
          define: {
            underscored: true, // 全局自动把驼峰转为下划线
            defaultScope: {
              attributes: {
                exclude: ['created_at', 'createdAt', 'updatedAt'],
              },
            },
          },
        };
      },
    }),

    // axios
    // HttpModule.registerAsync({
    //   imports: [ConfigModule],
    //   inject: [ConfigService],
    //   useFactory(configService: ConfigService) {
    //     return {
    //       timeout: +configService.get('HTTP_TIMEOUT'),
    //       maxRedirects: +configService.get('HTTP_MAX_REDIRECTS'),
    //     };
    //   },
    // }),

    // axios
    HttpModule,

    // jwt
    JwtModule.registerAsync({
      global: true,
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          secret: configService.get('JWT_SECRET'),
          signOptions: { expiresIn: '7200s' },
        };
      },
    }),

    AuthModule,

    RoleModule,

    TenantModule,

    PermissionModule,
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
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
      useClass: AuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: PermissionGuard,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    },
    // {
    //   provide: APP_INTERCEPTOR,
    //   useClass: LoggingInterceptor,
    // },
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

    // 自定义provider 指定scope
    /*{
      provide: 'CACHE_MANAGER',
      useClass: CacheManager,
      scope: Scope.TRANSIENT,
    },*/
    Logger,
  ],
  controllers: [AppController],
})
export class AppModule implements NestModule, OnModuleInit, OnApplicationShutdown {
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
  onModuleInit() {
    console.log('[AppModule] onModuleInit has been called.'); 
  }
  onApplicationShutdown(signal?: string) {
    console.log('[AppModule] onApplicationnShutdown - signal: ', signal);
  }
}

