import { User } from '@/common/decorators/user.decorator';
import StatusCodeEnum from '@/common/enums/StatusCodeEnum';
import { LoggingInterceptor } from '@/common/interceptors/logging.interceptor';
import JoiValidationPipe from '@/common/pipes/joiValidation.pipe';
import { ValidationPipe } from '@/common/pipes/validation.pipe';
import { BusinessException } from '@/common/utils/businessException';
import genResponse from '@/common/utils/genResponse';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  HttpException,
  HttpStatus,
  Inject,
  Param,
  ParseIntPipe,
  ParseUUIDPipe,
  Post,
  Query,
  Scope,
  SetMetadata,
  UseFilters,
  UseGuards,
  UseInterceptors,
  UsePipes,
} from '@nestjs/common';
import { Cache } from 'cache-manager';
// import {HttpExceptionFilter} from '@/filters/httpException.filter';
import CatsService from './cat.service';
import { CreateCatDto, createCatSchema } from './dto/create-cat.dto';
import { Cat } from './interfaces/cat.interface';
import { Permissions } from '@/common/decorators/permission.decorator';
import { Permission } from '@/common/enums/permission';

// @Controller({ path: 'cat' })
// 指定scope
// CatsController <- CatsService <- CatsRepository
/**
 * 当涉及到选择最佳的注入作用域时，具体场景会起到关键的作用。以下是一些具体场景的示例，以及在这些场景下最佳选择的注入作用域：

1. 默认作用域：
辅助工具类：如果你有一个辅助工具类，不依赖于任何状态或数据，每次需要一个新的实例时，默认作用域是最合适的选择。
日志记录器：如果你的日志记录器是无状态的，并且每次需要一个新的实例记录日志时，默认作用域是适合的。

2. 单例作用域：
数据库连接：如果你有一个数据库连接对象，多个组件或服务需要共享同一个连接对象时，单例作用域是最合适的选择。
共享状态：如果你有一个包含应用程序状态的对象，需要在应用程序的不同部分之间共享数据时，单例作用域是适合的。

3. 请求作用域：
身份认证信息：如果你需要在每个请求中访问当前用户的身份认证信息，并确保每个请求之间的隔离性，请求作用域是最佳的选择。
请求级别的资源：如果你有一些需要在每个请求期间共享和管理的资源，例如数据库连接池或文件句柄，请求作用域是适合的。

4. 传递作用域：
嵌套作用域：如果你有一些依赖关系需要在嵌套的作用域中保持独立，并且需要更细粒度地控制作用域的生命周期，传递作用域是最佳的选择。
需要注意的是，以上示例仅供参考，并不是所有场景都适用。选择最佳的注入作用域时，应根据具体的业务需求、数据共享和隔离的要求，以及依赖的生命周期管理来评估和决策。
 */
@Controller({
  path: 'cat',
  // scope: Scope.REQUEST,
})
// @UseGuards(new RolesGuard())
// @UseInterceptors(LoggingInterceptor)
export class CatController {
  constructor(
    /** @Inject(CACHE_MANAGER) private cacheManager: Cache, */
    private catsService: CatsService,
    @Inject(CACHE_MANAGER)
    private cacheManager: Cache,
  ) {}

  @Post()
  // @UsePipes(new JoiValidationPipe(createCatSchema)) // 字段校验
  // @SetMetadata('roles', ['admin'])
  @Permissions(Permission.CAT_CREATE)
  async create(
    // @Body(new ValidationPipe()) createCatDto: CreateCatDto, // ValidationPipe比较通用，可作为全局pipe
    @Body() createCatDto: CreateCatDto,
  ) {
    // const sleep = (ms: number) => {
    //   return new Promise(resolve => {
    //     setTimeout(resolve, ms);
    //   });
    // }
    // await sleep(6000);
    // @ts-ignore
    // a.b = 1;
    // throw new Error();
    if (Math.random() > 0.5) {
      this.catsService.create(createCatDto);
      return genResponse.success();
    } else {
      // throw new ForbiddenException(genResponse.fail(
      //   StatusCodeEnum.FORBIDDEN_ENTER.code,
      //   StatusCodeEnum.FORBIDDEN_ENTER.message,
      // ));
      throw new BusinessException(
        genResponse.fail(StatusCodeEnum.FORBIDDEN_ENTER),
      );
    }
  }

  @Get()
  async findAll() {
    this.catsService.findAll();
  }

  // @Get(':id')
  // // @UseGuards(new RolesGuard())
  // async findOne(@Param('id') id: number) {
  //   return genResponse.success(id);
  // }

  @Get('/testStatusCode')
  testStatusCode() {
    return genResponse.success<string[]>([]);
  }

  @Post('/testRedis')
  testRedis(@Body() testRedisBody: Record<string, string>) {
    try {
      Object.keys(testRedisBody).forEach(async (key) => {
        // @ts-ignore // ts草泥马
        await this.cacheManager.set(key, testRedisBody[key], { ttl: 300 });
      });
      return genResponse.success();
    } catch (err) {
      throw new BusinessException(
        genResponse.fail(StatusCodeEnum.UNKNOWN_ERROR),
      );
    }
  }

  @Get('/testRedis')
  async testGetRedis(@Query('key') key: string) {
    try {
      const value = await this.cacheManager.get(key);
      return genResponse.success(value);
    } catch (err) {
      console.log(err);
      throw new BusinessException(
        genResponse.fail(StatusCodeEnum.UNKNOWN_ERROR),
      );
    }
  }

  @Get('/testDecorator')
  // @ts-ignore
  // async findOne(@User(new ValidationPipe({ validateCustomDecorators: true })) user: UserEntity) {
  async findOne(@User('firstName') firstName: string) {
    console.log('firstName: ', firstName);
  }
}
