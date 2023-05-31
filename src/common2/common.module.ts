import { forwardRef, Module } from '@nestjs/common';
import { CatModule } from '@/cat/cat.module';
import CatsService from '@/cat/cat.service';
import { CommonController } from './common.controller';
import { CommonService } from './common.service';

@Module({
  // imports: [
  //   forwardRef(() => CatModule),
  // ],
  controllers: [CommonController],
  providers: [
    CommonService,
    CatsService,
  ],
})
export class CommonModule {}
