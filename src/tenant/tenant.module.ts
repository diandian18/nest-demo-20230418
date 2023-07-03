import { AuthService } from '@/auth/auth.service';
import { UserModel, UserTenantModel } from '@/user/user.model';
import { Logger, Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { TenantController } from './tenant.controller';
import { TenantModel } from './tenant.model';
import { TenantService } from './tenant.service';

@Module({
  imports: [
    SequelizeModule.forFeature([TenantModel, UserModel, UserTenantModel]),
  ], 
  exports: [SequelizeModule],
  controllers: [TenantController],
  providers: [TenantService, Logger, AuthService], // Logger需要手动声明下，不然service注入不了
})
export class TenantModule {}
