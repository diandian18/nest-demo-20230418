import StatusCodeEnum from '@/enums/StatusCodeEnum';
import {BusinessException} from '@/utils/businessException';
import genResponse from '@/utils/genResponse';
import { Body, Controller, Post } from '@nestjs/common';
import {LoginDto, registerDto} from './user.dto';
import {UserService} from './user.service';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Post('/register')
  register(@Body() registerDto: registerDto) {
    try {
      this.userService.register(registerDto);
      return genResponse.success();
    } catch (err) {
      throw new BusinessException(genResponse.fail(StatusCodeEnum.UNKNOWN_ERROR.code, JSON.stringify(err)));
    }
  }

  @Post('/login')
  async login(@Body() reqBody: LoginDto) {
    try {
      await this.userService.login(reqBody);
      return genResponse.success();
    } catch (err) {
      throw new BusinessException(genResponse.fail(StatusCodeEnum.UNKNOWN_ERROR.code, JSON.stringify(err)));
    }
  }
}
