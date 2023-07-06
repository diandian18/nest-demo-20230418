import { Public, ReqUser } from '@/auth/auth.decorator';
import { Body, Controller, Get, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import { PostLoginReqDto, PostRegisterReqDto, PostSwitchTenantReqDto, PutResetPasswordReqDto, PutUserReqDto, RedisTokenUserDto, UserDto2 } from './user.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  // @Permissions()
  @Get('findAll')
  async findAll() {
    return await this.userService.findAll();
  }

  @Get('findOne/:userId')
  async findOne(@Param('userId') userId: number) {
    return await this.userService.findOne(userId);
  }

  @Post('createMany')
  async createMany(@Body() users: UserDto2[]) {
    await this.userService.createMany(users);
    return;
  }

  @Put('updateOne')
  async updateOne(@Body('userId') userId: number) {
    await this.userService.updateOne(userId);
    return;
  }

  @Post('register')
  @Public()
  async postRegister(@Body() registerDto: PostRegisterReqDto) {
    await this.userService.postRegister(registerDto);
    // 不需要return，return undifined 就表示200成功
  }

  @Post('login')
  @Public()
  async postLogin(@Body() loginDto: PostLoginReqDto) {
    return await this.userService.postLogin(loginDto);
  }

  @Post('refresh-token')
  async postRefreshToken(@Body('refreshToken') refreshToken: string) {
    return await this.userService.postRefreshToken(refreshToken);
  }

  @Post('logout')
  async postLogout(@ReqUser() user: RedisTokenUserDto) {
    await this.userService.postLogout(user);
  }

  @Put('reset-password')
  async putResetPassword(@ReqUser() user: RedisTokenUserDto, @Body() putResetPasswordReqDto: PutResetPasswordReqDto) {
    await this.userService.putResetPassword(user, putResetPasswordReqDto);
  }

  @Put(':userId')
  async putUser(@Param('userId', ParseIntPipe) userId: number, @Body() user: PutUserReqDto) {
    await this.userService.putUser(userId, user);
  }

  //@Get(':userId')
  //async getUser(@Param('userId', ParseIntPipe) userId: number) {
    //return await this.userService.getUser(userId);
  //}

  @Get('mine')
  async getMine(@ReqUser() user: RedisTokenUserDto) {
    return await this.userService.getMine(user);
  }

  @Post('switch')
  async postSwitchTenant(@ReqUser() user: RedisTokenUserDto, @Body() postSwitchTenantReqDto: PostSwitchTenantReqDto) {
    return await this.userService.postSwitchTenant(user, postSwitchTenantReqDto);
  }
}
