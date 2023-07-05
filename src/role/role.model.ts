import { BaseModel } from '@/common/sequelize';
import { TenantModel } from '@/tenant/tenant.model';
import { UserModel } from '@/user/user.model';
import { BelongsTo, BelongsToMany, Column, ForeignKey, HasMany, Table } from 'sequelize-typescript';
import { RoleStatus } from './role.dto';
import { PermissionType } from './role.type';

/**
 * 角色表
 */
@Table({
  tableName: 'role',
})
export class RoleModel extends BaseModel {
  @Column({ primaryKey: true })
  roleId: number;
  @Column
  roleName: string;

  // 租户 -> 角色
  @ForeignKey(() => TenantModel)
  @Column
  tenantId: number;
  @BelongsTo(() => TenantModel) 
  tenant: TenantModel;

  @Column
  roleStatus: RoleStatus;
  @Column
  editableFlag: BlEnum;
  @Column
  remark: string;
  @Column
  deleteFalg: BlEnum;

  // 角色 -> 用户
  //@HasMany(() => UserModel)
  //users: UserModel[];

  // 角色 <-> 权限
  @BelongsToMany(() => PermissionModel, () => RolePermissionModel)
  permissions: PermissionModel[];
}

/**
 * 权限表
 */
@Table({
  tableName: 'permission',
})
export class PermissionModel extends BaseModel {
  @Column({ primaryKey: true })
  permissionId: number;
  @Column
  parentId: number;
  @Column
  hasChildren: BlEnum;
  @Column
  permissionName: string;
  @Column
  permissionCode: string;
  @Column
  permissionType: PermissionType;
  @Column
  permissionLevel: number;
  @Column
  sequence: number;
  @Column
  remark: string;
  @Column
  deleteFlag: BlEnum;

  // 角色 <-> 权限
  @BelongsToMany(() => RoleModel, () => RolePermissionModel)
  roles: RoleModel[];
}

/**
 * 角色-权限关联表
 */
@Table({
  tableName: 'role_permission',
})
export class RolePermissionModel extends BaseModel {
  @Column({ primaryKey: true })
  id: number;

  @ForeignKey(() => RoleModel)
  @Column
  roleId: number;

  @ForeignKey(() => PermissionModel)
  @Column
  permissionId: number;

  @Column
  deleteFlag: BlEnum;
}

