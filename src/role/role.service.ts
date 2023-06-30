import { genId } from '@/common/utils/number';
import { RedisTokenUserDto } from '@/user/user.dto';
import { Injectable, Logger, Scope } from '@nestjs/common';
import { PostRoleReqDto } from './role.dto';

@Injectable({ scope: Scope.REQUEST })
export class RoleService {
  constructor(
    private logger: Logger,
  ) {}
  async postRoles(user: RedisTokenUserDto, postRoleReqDtos: PostRoleReqDto[]) {
    // const { tenantId } = user;
    postRoleReqDtos.forEach(async (postRoleReqDto) => {
      const roleId = await genId();
      const { roleName, remark } = postRoleReqDto;
      const toSaveData = {
        roleId,
        roleName,
        //tenantId,
        roleStatus: true,
        editableFlag: true,
        remark,
        deleteFalg: false,
      };
      this.logger.log(toSaveData);
    });
  }
}

