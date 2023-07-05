import { TenantModel } from '@/tenant/tenant.model';
import { UserModel } from '@/user/user.model';
import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { UserTenantRoleModel } from './user-tenant-role.model';
import { UserTenantRoleService } from './user-tenant-role.service';

@Module({
  imports: [
    SequelizeModule.forFeature([TenantModel, UserModel, UserTenantRoleModel]),
  ], 
  providers: [UserTenantRoleService]
})
export class UserTenantRoleModule {}
