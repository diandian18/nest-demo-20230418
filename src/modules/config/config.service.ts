import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export default class ConfigService {
  constructor(@Inject('CONFIG_OPTIONS') options) {
    console.log(options);
  }
  get() {

  }
}
