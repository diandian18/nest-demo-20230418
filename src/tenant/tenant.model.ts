import { BaseModel } from '@/common/sequelize';
import { User } from '@/user/user.model';
import { Column, HasMany, Table} from "sequelize-typescript";
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

  @HasMany(() => User)
  users: User[];
}

