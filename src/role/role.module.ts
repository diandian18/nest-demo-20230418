import { Logger, Module } from '@nestjs/common';
import { RoleService } from './role.service';
import { RoleController } from './role.controller';

@Module({
  providers: [RoleService, Logger],
  controllers: [RoleController]
})
export class RoleModule {}
