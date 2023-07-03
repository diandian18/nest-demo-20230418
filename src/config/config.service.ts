import { isEnvTrue } from '@/common/utils/type';
import {EnvConfig} from '@/types';
import { Inject, Injectable } from '@nestjs/common';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';
import {MODULE_OPTIONS_TOKEN} from './config.module-definition';
// import {CONFIG_OPTIONS} from './config.consts';
import {ConfigOptions} from './config.types';

@Injectable()
export class ConfigService {
  private readonly envConfig: EnvConfig;

  constructor(
    @Inject(MODULE_OPTIONS_TOKEN  /* CONFIG_OPTIONS */)
    options: ConfigOptions,
  ) {
    console.log('[ConfigService] options: ', JSON.stringify(options));
    const filePath = `${process.env.NODE_ENV || 'dev'}.env`;
    const envFile = path.resolve(__dirname, '../../', options.folder, filePath);
    this.envConfig = dotenv.parse<EnvConfig>(fs.readFileSync(envFile));
  }

  get(key: string): string {
    return this.envConfig[key];
  }
}

