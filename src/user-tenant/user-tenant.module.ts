import { TenantModel } from '@/tenant/tenant.model';
import { UserModel } from '@/user/user.model';
import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { UserTenantModel } from './user-tenant.model';
import { UserTenantService } from './user-tenant.service';

@Module({
  imports: [
    SequelizeModule.forFeature([TenantModel, UserModel, UserTenantModel]),
  ], 
  providers: [UserTenantService]
})
export class UserTenantModule {}

