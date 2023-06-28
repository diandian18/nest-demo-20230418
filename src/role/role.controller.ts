import { ReqUser } from '@/auth/auth.decorator';
import { UserRetDto } from '@/user/user.dto';
import { Body, Controller, Post } from '@nestjs/common';
import { PostRoleReqDto } from './role.dto';
import { RoleService } from './role.service';

@Controller('role')
export class RoleController {
  constructor(
    private roleService: RoleService,
  ) {}
  @Post()
  async postRole(
    @ReqUser() user: UserRetDto,
    @Body() postRoleReqDto: PostRoleReqDto,
  ) {
    this.roleService.postRole(user, postRoleReqDto); 
  }
}
