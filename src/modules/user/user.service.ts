import { Injectable } from '@nestjs/common';
import {RedisService} from '../redis/redis.service';
import {LoginDto, registerDto} from './user.dto';

@Injectable()
export class UserService {
  constructor(private redisService: RedisService) {}

  register(registerDto: registerDto) {
      
  }

  async login(reqBody: LoginDto) {
    const { userAccount, userPassword } = reqBody;
    const token = this.genToken(userAccount, userPassword); 
    // @ts-ignore
    await this.redisService.cache.set(token, 1, { ttl: 2 * 60 * 60 });
  }

  genToken(userAccount: string, userPassword: string) {
    return `${userAccount}-${userPassword}`;
  } 
}

