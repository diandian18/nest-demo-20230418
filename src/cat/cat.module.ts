import { forwardRef, Global, Module } from '@nestjs/common';
import CatsService from './cat.service';
import { CatController } from './cat.controller';
import {CONNECTION} from '@/common/consts/customProvider';
import {connection} from '@/common/customProviders/aExample';
import {CommonModule} from '@/common2/common.module';
import {CommonService} from '@/common2/common.service';

// @Global()
@Module({
  // imports: [
  //   forwardRef(() => CommonModule),
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
    CommonService,
  ],
  exports: [CatsService],
})
export class CatModule {}
