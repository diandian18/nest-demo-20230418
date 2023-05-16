import {User} from '@/decorators/user.decorator';
import {Permission} from '@/enums/permission';
import StatusCodeEnum from '@/enums/StatusCodeEnum';
import {Permissions} from '@/guards/permission.decorator';
import {LoggingInterceptor} from '@/interceptors/logging.interceptor';
import JoiValidationPipe from '@/pipes/joiValidation.pipe';
import {ValidationPipe} from '@/pipes/validation.pipe';
import {BusinessException} from '@/utils/businessException';
import genResponse from '@/utils/genResponse';
import {CACHE_MANAGER} from '@nestjs/cache-manager';
import { Body, Controller, ForbiddenException, Get, HttpException, HttpStatus, Inject, Param, ParseIntPipe, ParseUUIDPipe, Post, Query, SetMetadata, UseFilters, UseGuards, UseInterceptors, UsePipes } from '@nestjs/common';
import {Cache} from 'cache-manager';
import {RedisService} from '../redis/redis.service';
// import {HttpExceptionFilter} from '@/filters/httpException.filter';
import CatsService from './cat.service';
import {CreateCatDto, createCatSchema} from './dto/create-cat.dto';
import {Cat} from './interfaces/cat.interface';

@Controller({ path: 'cat' })
// @UseGuards(new RolesGuard())
// @UseInterceptors(LoggingInterceptor)
export class CatController {
  constructor(
    /** @Inject(CACHE_MANAGER) private cacheManager: Cache, */
    private catsService: CatsService,
    private redisService: RedisService,
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
      throw new BusinessException(genResponse.fail(
        StatusCodeEnum.FORBIDDEN_ENTER.code,
        StatusCodeEnum.FORBIDDEN_ENTER.message,
      ));
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
      Object.keys(testRedisBody).forEach(async key => {
        // @ts-ignore // ts草泥马
        await this.redisService.cache.set(key, testRedisBody[key], { ttl: 300 });
      });
      return genResponse.success();
    } catch (err) {
      throw new BusinessException(genResponse.fail(StatusCodeEnum.UNKNOWN_ERROR));
    }
  }

  @Get('/testRedis')
  async testGetRedis(@Query('key') key: string) {
    try {
      const value = await this.redisService.cache.get(key);
      return genResponse.success(value);
    } catch (err) {
      console.log(err);
      throw new BusinessException(genResponse.fail(StatusCodeEnum.UNKNOWN_ERROR)); 
    }
  }

  @Get('/testDecorator')
  // @ts-ignore
  // async findOne(@User(new ValidationPipe({ validateCustomDecorators: true })) user: UserEntity) {
  async findOne(@User('firstName') firstName: string) {
    console.log('firstName: ', firstName);
  }
}

