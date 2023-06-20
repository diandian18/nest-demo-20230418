import { genRandomNumber } from '@/common/utils/string';
import { enumer } from '@/common/utils/type';
import { Inject, Injectable, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { InjectModel } from '@nestjs/sequelize';
import { plainToInstance } from 'class-transformer';
import { Request } from 'express';
import { GetTenantResDto, PostTenantReqDto, PutTenantReqDto } from './tanant.dto';
import { TenantModel } from './tenant.model';
import { TenantStatus } from './tenant.type';

@Injectable({ scope: Scope.REQUEST })
export class TenantService {
  constructor(
    @Inject(REQUEST)
    private request: Request,
    @InjectModel(TenantModel)
    private tenantModel: typeof TenantModel,
  ) {}
  async postTenant(postTenantDto: PostTenantReqDto) {
    console.log(this.request.headers);
    const toSaveTenant = {
      tenantName: postTenantDto.tenantName,
      contactName: postTenantDto.contactName,
      contactMobile: postTenantDto.contactMobile,
      contactEmail: postTenantDto.contactEmail,
      remark: postTenantDto.remark ?? '',

      tenantId: genRandomNumber(),
      tenantStatus: TenantStatus.ACTIVE,
      // forbiddenReason: '',
      // deleteFlag: enumer(false),
    };
    // await this.tenantModel.create(toSaveTenant);
  }

  async getTenant(tenantId: number) {
    const tenantDb = await this.tenantModel.findOne({
      where: {
        tenantId,
      },
    });
    const tenantRet = plainToInstance(GetTenantResDto, tenantDb);
    return tenantRet;
  }

  async putTenant(tenantId: number, putTenantReqDto: PutTenantReqDto) {
    await this.tenantModel.update(putTenantReqDto, {
      where: {
        tenantId,
      },
    });
  }

  async deleteTenant(tenantId: number) {
    await this.tenantModel.update({
      deleteFlag: enumer(true),
    }, {
      where: {
        tenantId,
      },
    });
  }
}
