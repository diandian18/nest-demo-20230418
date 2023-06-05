// import StatusCodeEnum from '@/common/enums/StatusCodeEnum';
// import {BusinessException} from '@/common/utils/businessException';
// import genResponse from '@/common/utils/genResponse';
import { Permissions } from '@/common/guards/permission.decorator';
import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
// import {plainToInstance} from 'class-transformer';
import { PostLoginReqDto, PostRegisterReqDto, UserDto } from './user.dto';
// import {User} from './user.model';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Permissions()
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
  async postRegister(@Body() registerDto: PostRegisterReqDto) {
    await this.userService.postRegister(registerDto);
    // 不需要return
  }

  @Post('login')
  async postLogin(@Body() loginDto: PostLoginReqDto) {
    return await this.userService.postLogin(loginDto);
  }

  // async login(loginDto: PostLoginReqDto) {
  //   const {username, password} = loginDto;
  //   const user = await this.userService.findOne(userId)
  //   // const token = this.genToken(username, password);
  //   // @ts-ignore
  //   // await this.redisService.cache.set(token, 1, { ttl: 2 * 60 * 60 });
  // }

  // genToken(userAccount: string, userPassword: string) {
  //   return `${userAccount}-${userPassword}`;
  // }
}
