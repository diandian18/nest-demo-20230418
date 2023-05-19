import { DynamicModule, Module } from '@nestjs/common';
import {ConfigurableModuleClass} from './config.module-definition';
import { ConfigService } from './config.service';
import {CONFIG_OPTIONS} from './consts';
import {ConfigOptions} from './types';

/*
// 用ConfigurableModuleClass替代简化这里
@Module({})
export class ConfigModule {
  // forFeature forFeatureAsync
  // forRoot forRootAsync
  // register registerAsync
  static register(options: ConfigOptions): DynamicModule {
    return {
      module: ConfigModule,
      providers: [{
        provide: CONFIG_OPTIONS,
        useValue: options,
      }, ConfigService],
      exports: [ConfigService],
    };
  }
}*/

@Module({
  providers: [ConfigService],
  exports: [ConfigService],
})
export class ConfigModule extends ConfigurableModuleClass {}

