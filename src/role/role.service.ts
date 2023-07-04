import { genId } from '@/common/utils/number';
import { RedisTokenUserDto } from '@/user/user.dto';
import { Injectable,/* Logger,*/ Scope } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { plainToInstance } from 'class-transformer';
import { GetPermissionsResDto, PostRoleReqDto } from './role.dto';
import { PermissionModel, RoleModel, RolePermissionModel } from './role.model';
import { TransactionOpts } from '@/types';

@Injectable({ scope: Scope.REQUEST })
export class RoleService {
  constructor(
    // private logger: Logger,
    @InjectModel(RoleModel)
    private roleModel: typeof RoleModel,
    @InjectModel(PermissionModel)
    private permissionModel: typeof PermissionModel,
    @InjectModel(RolePermissionModel)
    private rolePermissionModel: typeof RolePermissionModel,
  ) {}
  async createRole(user: RedisTokenUserDto, postRoleReqDto: PostRoleReqDto, permissions: number[], transactionOpts?: TransactionOpts) {
    const { currentTenantId } = user;
    const roleId = await genId();
    const { roleName, remark, tenantId } = postRoleReqDto;
    const toSaveData = {
      roleId,
      roleName,
      tenantId: tenantId ?? currentTenantId,
      roleStatus: true,
      editableFlag: true,
      remark,
      deleteFlag: false,
    };
	  await this.roleModel.create(toSaveData, transactionOpts);
    // 关联表批量创建
    await this.rolePermissionModel.bulkCreate(
      permissions.map(permissionId => {
        return {
          roleId,
          permissionId,
        };
      }),
      transactionOpts,
    );
    return roleId;
  }

  async createAdminRole(user: RedisTokenUserDto, tenantId: number, transactionOpts?: TransactionOpts) {
    const allPermissions = await this.permissionModel.findAll();
    const permissions = allPermissions.map(({ permissionId }) => permissionId);
    console.log(permissions);
    return await this.createRole(user, {
      roleName: '管理员',
      remark: '拥有所有权限',
      tenantId,
    }, permissions, transactionOpts);
  }

  async getPermissions() {
    const permissionsDb = await this.permissionModel.findAll();
    const ret = plainToInstance(GetPermissionsResDto, permissionsDb);
    const permissionsMap = aryToMap<number, GetPermissionsResDto>(ret, 'permissionId');

    const retAry: GetPermissionsResDto[] = [];
    permissionsMap.forEach((item) => {
      const { parentId } = item;
      if (parentId === 0) {
        retAry.push(item);
      } else {
        const parent = permissionsMap.get(parentId);
        parent?.children?.push(item);
      }
    });
    return retAry;
  }
}

function aryToMap<K, T>(ary: T[], key: string) {
  const map = new Map<K, T>();
  ary.forEach(item => {
    map.set(item[key], { ...item, children: [] });
  });
  return map;
}

