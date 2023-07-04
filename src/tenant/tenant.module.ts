import { AuthService } from '@/auth/auth.service';
import { PermissionModel, RoleModel, RolePermissionModel } from '@/role/role.model';
import { RoleService } from '@/role/role.service';
import { UserTenantModel } from '@/user-tenant/user-tenant.model';
import { UserTenantService } from '@/user-tenant/user-tenant.service';
import { Photo, UserModel } from '@/user/user.model';
import { UserService } from '@/user/user.service';
import { Logger, Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { TenantController } from './tenant.controller';
import { TenantModel } from './tenant.model';
import { TenantService } from './tenant.service';

@Module({
  imports: [
    SequelizeModule.forFeature([TenantModel, UserModel, UserTenantModel, RoleModel, PermissionModel, RolePermissionModel, Photo]),
  ], 
  exports: [SequelizeModule],
  controllers: [TenantController],
  providers: [TenantService, Logger, AuthService, RoleService, UserService, UserTenantService], // Logger需要手动声明下，不然service注入不了
})
export class TenantModule {}
