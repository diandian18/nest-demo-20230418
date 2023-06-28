import { BaseModel } from '@/common/sequelize';
import { UserModel } from '@/user/user.model';
import { Column, HasMany, Table } from 'sequelize-typescript';
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
  @Column
  tenantId: number;
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

