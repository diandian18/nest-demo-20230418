import { genId } from '@/common/utils/number';
import { RedisTokenUserDto } from '@/user/user.dto';
import { Injectable,/* Logger,*/ Scope } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { plainToInstance } from 'class-transformer';
import { GetPermissionsResDto, PostRoleReqDto } from './role.dto';
import { PermissionModel, RoleModel } from './role.model';

@Injectable({ scope: Scope.REQUEST })
export class RoleService {
  constructor(
    // private logger: Logger,
    @InjectModel(RoleModel)
    private roleModel: typeof RoleModel,
    @InjectModel(PermissionModel)
    private permissionModel: typeof PermissionModel,
  ) {}
  async postRoles(user: RedisTokenUserDto, postRoleReqDto: PostRoleReqDto) {
    const { currentTenantId: tenantId } = user;
    const roleId = await genId();
    const { roleName, remark } = postRoleReqDto;
    const toSaveData = {
      roleId,
      roleName,
      tenantId,
      roleStatus: true,
      editableFlag: true,
      remark,
      deleteFalg: false,
    };
    // this.logger.log(toSaveData);
	  await this.roleModel.create(toSaveData);
  }

  async getPermissions() {
    const permissionsDb = await this.permissionModel.findAll();
    const ret = plainToInstance(GetPermissionsResDto, permissionsDb);
    // const levelMap = groupBy(ret, 'permissionLevel');
  }
}

