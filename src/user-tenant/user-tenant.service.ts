import { TransactionOpts } from '@/types';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { UserTenantModel } from './user-tenant.model';

@Injectable()
export class UserTenantService {
  constructor(
    @InjectModel(UserTenantModel)
    private userTenantModel: typeof UserTenantModel,
  ) {}
  async createOne(userId: number, tenantId: number, transactionOpts: TransactionOpts) {
    await this.userTenantModel.create({
      userId,
      tenantId,
    }, transactionOpts);
  }
}

