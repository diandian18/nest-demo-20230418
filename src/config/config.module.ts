import { DynamicModule, Module } from '@nestjs/common';
import {ASYNC_OPTIONS_TYPE, ConfigurableModuleClass, OPTIONS_TYPE} from './config.module-definition';
import { ConfigService } from './config.service';

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
export class ConfigModule extends ConfigurableModuleClass {
  // The auto-generated static methods (register, registerAsync, etc.) can be extended if needed, as follows:
  // 会影响imports
  static register(options: typeof OPTIONS_TYPE): DynamicModule {
    return {
      // your custom logic here
      ...super.register(options),
    };
  }

  static registerAsync(options: typeof ASYNC_OPTIONS_TYPE): DynamicModule {
    return {
      // your custom logic here
      ...super.registerAsync(options),
    };
  }
}

