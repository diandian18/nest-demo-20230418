import { BaseModel } from '@/common/sequelize';
import { TenantModel } from '@/tenant/tenant.model';
import { UserModel } from '@/user/user.model';
import { Column, ForeignKey, Table } from 'sequelize-typescript';

/**
 * 用户-租户关联表
 */
@Table({
  tableName: 'user_tenant',
})
export class UserTenantModel extends BaseModel {
  @Column({ primaryKey: true })
  id: number;

  @ForeignKey(() => UserModel)
  @Column
  userId: number;
  //@BelongsTo(() => UserModel)
  //user: UserModel;

  @ForeignKey(() => TenantModel)
  @Column
  tenantId: number;
  //@BelongsTo(() => TenantModel)
  //tenant: TenantModel;

  @Column
  deleteFlag: BlEnum;
}

