import { genId } from '@/common/utils/number';
import { RedisTokenUserDto } from '@/user/user.dto';
import { Injectable,/* Logger,*/ Scope } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { plainToInstance } from 'class-transformer';
import { GetPermissionsResDto as GetAllPermissionsResDto, PostRoleReqDto, PutRolePermissionReqDto } from './role.dto';
import { PermissionModel, RoleModel, RolePermissionModel } from './role.model';
import { TransactionOpts } from '@/types';
import { Op } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';
import { aryToMap } from '@/common/utils/ary';

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
    private sequelize: Sequelize,
  ) {}

  /**
   * 创建角色通用方法
   */
  async createRole(user: RedisTokenUserDto, postRoleReqDto: PostRoleReqDto, permissions: number[], transactionOpts?: TransactionOpts) {
    const { tenantId: currentTenantId } = user;
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

  /**
   * 利用createRole创建admin角色
   */
  async createAdminRole(user: RedisTokenUserDto, tenantId: number, transactionOpts?: TransactionOpts) {
    const allPermissions = await this.permissionModel.findAll();
    const permissions = allPermissions.map(({ permissionId }) => permissionId);
    return await this.createRole(user, {
      roleName: '管理员',
      remark: '拥有所有权限',
      tenantId,
    }, permissions, transactionOpts);
  }

  /**
   * 查询roleId下的所有权限code
   */
  async getPermissionsByRoleId(roleId: number) {
    const retRolePermissions = await this.rolePermissionModel.findAll({
      where: { roleId },
    });
    const retPermissions = await this.permissionModel.findAll({
      where: {
        permissionId: {
          [Op.in]: retRolePermissions.map(item => item.permissionId),
        },
      },
    });
    const permissions = retPermissions.map(item => item.permissionCode);
    return permissions;
  }

  /**
   * 获取所有权限树
   */
  async getAllPermissions() {
    const permissionsDb = await this.permissionModel.findAll();
    const ret = plainToInstance(GetAllPermissionsResDto, permissionsDb);
    const permissionsMap = aryToMap<number, GetAllPermissionsResDto>(ret, 'permissionId');

    const retAry: GetAllPermissionsResDto[] = [];
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

  /**
   * 更新某角色下的权限
   */
  async putPermissionOfRole(roleId: number, putRolePermissionReqDto: PutRolePermissionReqDto) {
    const { permissionIdList } = putRolePermissionReqDto;
    this.sequelize.transaction(async transaction => {
      // 删除该角色下所有权限
      await this.rolePermissionModel.destroy({
        where: { roleId },
        transaction,
      }); 
      // 新增该角色下新权限
      const toSaveData = permissionIdList.map(permissionId => {
        return {
          roleId,
          permissionId,
        };
      }) 
      await this.rolePermissionModel.bulkCreate(toSaveData, { transaction });
    });
  }
}

