import {CONNECTION} from '@/consts/customProvider';
import {Connection} from '@/customProviders/aExample';
import { forwardRef, HttpException, HttpStatus, Inject, Injectable, OnModuleInit, Scope } from '@nestjs/common';
import {ModuleRef, REQUEST} from '@nestjs/core';
import {Request} from 'express';
import {CommonService} from '../common/common.service';
import {Cat} from './interfaces/cat.interface';

// @Injectable()
// 指定scope
// 加了这个后，每个CatsService实例都是分别单独的，get cats会一直为[]
@Injectable({ scope: Scope.REQUEST })
export default class CatsService implements OnModuleInit {
  private readonly cats: Cat[] = [];
  private commonService2: CommonService;

  // constructor(@Optional() @Inject('HTTP_OPTIONS') private httpClient: T) {
    // console.log(httpClient);
  // }
  constructor(
    // 和 @Injectable({ scope: Scope.REQUEST }) 配套使用，访问原始请求对象
    // https://docs.nestjs.com/fundamentals/injection-scopes#request-provider
    @Inject(REQUEST)
    private request: Request,
    @Inject(CONNECTION)
    private connection: Connection,
    // 循环依赖
    // 否则报错: - A circular dependency between modules. Use forwardRef() to avoid it. Read more: https://docs.nestjs.com/fundamentals/circular-dependency
    @Inject(forwardRef(() => CommonService))
    private commonService: CommonService,
    // 模块引用
    private commonModuleRef: ModuleRef,
  ) {
    console.log('[CatsService] connection: ', connection);
    // console.log('[CatsService] commonModuleRef: ', commonModuleRef);
    // console.log('[CatsService] constructor request: ', request);
  }

  async onModuleInit() {
    console.log('xxxxxxxx [onModuleInit] xxxxxxx 为何没生效');
    this.commonService2 = await this.commonModuleRef.resolve(
      CommonService,
      // 全局
      // {strict: false}
    );
  }

  create(cat: Cat) {
    console.log('create: ', cat);
    this.cats.push(cat);
  }

  findAll(): Cat[] {
    console.log(this.cats);
    return this.cats; 
  }
}

