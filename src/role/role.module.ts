import { Logger, Module } from '@nestjs/common';
import { RoleService } from './role.service';
import { RoleController } from './role.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { PermissionModel, RoleModel, RolePermissionModel } from './role.model';

@Module({
  imports: [
    SequelizeModule.forFeature([RoleModel, PermissionModel, RolePermissionModel]),
  ],
  providers: [RoleService, Logger],
  controllers: [RoleController]
})
export class RoleModule {}
