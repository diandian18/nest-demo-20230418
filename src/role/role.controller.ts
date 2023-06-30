import { ReqUser } from '@/auth/auth.decorator';
import { RedisTokenUserDto } from '@/user/user.dto';
import { Body, Controller, Post } from '@nestjs/common';
import { PostRoleReqDto } from './role.dto';
import { RoleService } from './role.service';

@Controller('role')
export class RoleController {
  constructor(
    private roleService: RoleService,
  ) {}
  @Post()
  async postRoles(
    @ReqUser() user: RedisTokenUserDto,
    @Body() postRoleReqDtos: PostRoleReqDto[],
  ) {
    this.roleService.postRoles(user, postRoleReqDtos); 
  }
}
