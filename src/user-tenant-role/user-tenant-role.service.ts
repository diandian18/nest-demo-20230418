import { TransactionOpts } from '@/types';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { plainToInstance } from 'class-transformer';
import { FindRoleByUserIdTenantIdReqDto } from './user-tenant-role.dto';
import { UserTenantRoleModel } from './user-tenant-role.model';

@Injectable()
export class UserTenantRoleService {
  constructor(
    @InjectModel(UserTenantRoleModel)
    private userTenantRoleModel: typeof UserTenantRoleModel,
  ) {}
  async createOne(userId: number, tenantId: number, roleId: number, transactionOpts?: TransactionOpts) {
    await this.userTenantRoleModel.create({
      userId,
      tenantId,
      roleId,
    }, transactionOpts); 
  }
  async findRoleByUserIdTenantId(userId: number, tenantId: number) {
    if (+tenantId === 0) {
      return {
        roleId: 0,
      };
    }
    const roleDb = await this.userTenantRoleModel.findOne({
      where: { userId, tenantId },
    });
    return plainToInstance(FindRoleByUserIdTenantIdReqDto, roleDb)
  }
}

