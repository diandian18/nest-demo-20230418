import {ConfigurableModuleBuilder} from "@nestjs/common";
import {ConfigOptions} from "./config.types";

export const {ConfigurableModuleClass, MODULE_OPTIONS_TOKEN, OPTIONS_TYPE, ASYNC_OPTIONS_TYPE/* CONFIG_OPTIONS */} = new ConfigurableModuleBuilder<ConfigOptions>()
  .setExtras(
    // 第一个参数为了设置默认值
    {
      isGlobal: true,
    },
    // definition 是自动生成的模块（带有providers exports imports controllers等）
    // extras 是额外属性（由消费者指定或默认值）
    (definition, extras) => ({
      ...definition,
      // 加了这个属性后，imports时可以传isGlobal了，否则报错
      global: extras.isGlobal,
    }),
  ) 
  .build();
// export const { ConfigurableModuleClass, CONFIG_OPTIONS } = new ConfigurableModuleBuilder<ConfigOptions>().setFactoryMethodName('createConfigOptions').build();
// export const { ConfigurableModuleClass, CONFIG_OPTIONS } = new ConfigurableModuleBuilder<ConfigOptions>().setClassMethodName('customFuncName').build();

