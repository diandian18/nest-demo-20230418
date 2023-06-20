import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { TenantController } from './tenant.controller';
import { TenantModel } from './tenant.model';
import { TenantService } from './tenant.service';

@Module({
  imports: [
    SequelizeModule.forFeature([TenantModel]),
  ], 
  exports: [SequelizeModule],
  controllers: [TenantController],
  providers: [TenantService]
})
export class TenantModule {}
