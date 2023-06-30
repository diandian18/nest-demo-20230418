import { BaseModel } from '@/common/sequelize';
import { RoleModel } from '@/role/role.model';
import { UserModel, UserTenantModel } from '@/user/user.model';
import { BelongsToMany, Column, HasMany, Table} from "sequelize-typescript";
import { TenantStatus } from './tenant.type';

/**
 * 租户表
 */
@Table({
  tableName: 'tenant',
})
export class TenantModel extends BaseModel {
  @Column({ primaryKey: true })
  tenantId: number;
  @Column
  tenantName: string;
  @Column
  tenantStatus: TenantStatus;
  @Column
  forbiddenReason: string;
  @Column
  contactName: string;
  @Column
  contactMobile: string;
  @Column
  contactEmail: string;
  @Column
  remark: string;
  @Column
  deleteFlag: BlEnum;

  // 多对多
  @BelongsToMany(() => UserModel, () => UserTenantModel) // 多对多
  users: UserModel[];

  // 一对多
  @HasMany(() => RoleModel)
  roles: RoleModel[];
}

