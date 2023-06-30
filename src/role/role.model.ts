import { BaseModel } from '@/common/sequelize';
import { TenantModel } from '@/tenant/tenant.model';
import { UserModel } from '@/user/user.model';
import { BelongsTo, Column, ForeignKey, HasMany, Table } from 'sequelize-typescript';
import { RoleStatus } from './role.dto';

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

  @HasMany(() => UserModel)
  users: UserModel[];
}

