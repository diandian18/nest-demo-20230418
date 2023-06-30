import { Logger, Module } from '@nestjs/common';
import { RoleService } from './role.service';
import { RoleController } from './role.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { RoleModel } from './role.model';

@Module({
  imports: [
    SequelizeModule.forFeature([RoleModel]),
  ],
  providers: [RoleService, Logger],
  controllers: [RoleController]
})
export class RoleModule {}
