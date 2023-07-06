import { ReqUser } from '@/auth/auth.decorator';
import { RedisTokenUserDto } from '@/user/user.dto';
import { Body, Controller, Get, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import { PostRoleReqDto, PutRolePermissionReqDto as PutPermissionOfRoleReqDto } from './role.dto';
import { RoleService } from './role.service';

@Controller('role')
export class RoleController {
  constructor(
    private roleService: RoleService,
  ) {}

  @Post()
  async postRoles(
    @ReqUser() user: RedisTokenUserDto,
    @Body() postRoleReqDto: PostRoleReqDto,
  ) {
    await this.roleService.createRole(user, postRoleReqDto, []); 
  }

  @Get('permissions')
  async getPermissions() {
    return await this.roleService.getAllPermissions();
  }

  @Put(':roleId')
  async putPermissionOfRole(
    @Param('roleId', ParseIntPipe) roleId: number,
    @Body() putPermissionOfRoleReqDto: PutPermissionOfRoleReqDto,
  ) {
    await this.roleService.putPermissionOfRole(roleId, putPermissionOfRoleReqDto);
  }
}
