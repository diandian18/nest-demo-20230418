import { BaseModel } from '@/common/sequelize';
import { RoleModel } from '@/role/role.model';
import { TenantModel } from '@/tenant/tenant.model';
import { UserModel } from '@/user/user.model';
import { Column, ForeignKey, Table } from 'sequelize-typescript';

/**
 * 用户-租户-角色关联表
 */
@Table({
  tableName: 'user_tenant_role',
})
export class UserTenantRoleModel extends BaseModel {
  @Column({ primaryKey: true })
  id: number;

  @ForeignKey(() => UserModel)
  @Column
  userId: number;

  @ForeignKey(() => TenantModel)
  @Column
  tenantId: number;

  @ForeignKey(() => RoleModel)
  @Column
  roleId: number;

  @Column
  deleteFlag: BlEnum;
}

