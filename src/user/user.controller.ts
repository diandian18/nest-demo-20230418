import StatusCodeEnum from '@/common/enums/StatusCodeEnum';
import {BusinessException} from '@/common/utils/businessException';
import genResponse from '@/common/utils/genResponse';
import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import {plainToInstance} from 'class-transformer';
import {LoginDto, RegisterDto, UserDto} from './user.dto';
import {User} from './user.model';
import {UserService} from './user.service';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('findAll')
  async findAll() {
    return await this.userService.findAll();
  }

  @Get('findOne/:userId')
  async findOne(@Param('userId') userId: number) {
    return await this.userService.findOne(userId);
  }

  @Post('createMany')
  async createMany(@Body() users: UserDto[]) {
    await this.userService.createMany(users);
    return;
  }

  @Put('updateOne')
  async updateOne(@Body('userId') userId: number) {
    await this.userService.updateOne(userId);
    return;
  }

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    await this.userService.register(registerDto); 
    // 不需要return
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return await this.userService.login(loginDto);
  }

  // async login(loginDto: LoginDto) {
  //   const {username, password} = loginDto;
  //   const user = await this.userService.findOne(userId)
  //   // const token = this.genToken(username, password); 
  //   // @ts-ignore
  //   // await this.redisService.cache.set(token, 1, { ttl: 2 * 60 * 60 });
  // }

  genToken(userAccount: string, userPassword: string) {
    return `${userAccount}-${userPassword}`;
  }
}

