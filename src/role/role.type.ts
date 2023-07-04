import { Transaction } from 'sequelize';

/**
 * 权限类型
 * 1.展示 2.接口
 */
export enum PermissionType {
  'VIEW',
  'API',
}

/**
 *
 */
export interface PostRolesOpts {
  tenantId?: number;
  modelOpts?: {
    transaction?: Transaction;
  };
}

