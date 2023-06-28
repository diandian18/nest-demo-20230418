import { genId } from '@/common/utils/number';
import { UserRetDto } from '@/user/user.dto';
import { Injectable, Logger, Scope } from '@nestjs/common';
import { PostRoleReqDto } from './role.dto';

@Injectable({ scope: Scope.REQUEST })
export class RoleService {
  constructor(
    private logger: Logger,
  ) {}
  async postRole(user: UserRetDto, postRoleReqDto: PostRoleReqDto) {
    const { tenantId } = user;
    const roleId = await genId();
    const { roleName, remark } = postRoleReqDto;
    const toSavingData = {
      roleId,
      roleName,
      tenantId,
      roleStatus: true,
      editableFlag: true,
      remark,
      deleteFalg: false,
    };
    this.logger.log(toSavingData);

  }
}

