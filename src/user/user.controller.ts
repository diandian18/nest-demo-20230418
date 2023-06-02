import StatusCodeEnum from '@/common/enums/StatusCodeEnum';
import {BusinessException} from '@/common/utils/businessException';
import genResponse from '@/common/utils/genResponse';
import { Body, Controller, Get, Post, Put } from '@nestjs/common';
import {plainToInstance} from 'class-transformer';
import {LoginDto, registerDto, UserDto} from './user.dto';
import {User} from './user.model';
import {UserService} from './user.service';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('findAll')
  async findAll() {
    return await this.userService.findAll();
  }

  @Get('findOne')
  async findOne() {

  }

  @Post('createMany')
  async createMany(@Body() users: UserDto[]) {
    await this.userService.createMany(users);
    return;
  }

  @Put('updateOne')
  async updateOne() {
    await this.userService.updateOne();
    return;
  }

  @Post('/register')
  register(@Body() registerDto: registerDto) {
    this.userService.register(registerDto);
    return genResponse.success();
  }

  @Post('/login')
  async login(@Body() reqBody: LoginDto) {
    await this.userService.login(reqBody);
    return genResponse.success();
  }
}
