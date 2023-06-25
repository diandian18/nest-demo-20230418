import { genRandomNumber } from '@/common/utils/string';
import { enumer } from '@/common/utils/type';
import { UserRetDto } from '@/user/user.dto';
import { User } from '@/user/user.model';
import { Injectable, Scope } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { plainToInstance } from 'class-transformer';
import { Sequelize } from 'sequelize-typescript';
import { GetTenantResDto, PostTenantReqDto, PutTenantReqDto } from './tanant.dto';
import { TenantModel } from './tenant.model';
import { TenantStatus } from './tenant.type';

@Injectable({ scope: Scope.REQUEST })
export class TenantService {
  constructor(
    private sequelize: Sequelize,
    @InjectModel(TenantModel)
    private tenantModel: typeof TenantModel,
    @InjectModel(User)
    private userModel: typeof User,
  ) {}
  async postTenant(user: UserRetDto, postTenantDto: PostTenantReqDto) {
    // 推荐这种写法，比较简洁，另一种写法需要手动抛错
    await this.sequelize.transaction(async (transaction) => {
      const transactionOpts = { transaction };
      const tenantId = genRandomNumber();
      const toSaveTenant = {
        tenantName: postTenantDto.tenantName,
        contactName: postTenantDto.contactName,
        contactMobile: postTenantDto.contactMobile,
        contactEmail: postTenantDto.contactEmail,
        remark: postTenantDto.remark ?? '',

        tenantId,
        tnantStatus: TenantStatus.ACTIVE,
        // forbiddenReason: '', // 有默认值的就不需要赋值了
        // deleteFlag: enumer(false),
      };
      await this.tenantModel.create(toSaveTenant, transactionOpts);
      await this.userModel.update({
        tenantId,
      }, {
        where: {
          userId: user.userId,
        },
        ...transactionOpts,
      });
    });
    // try {
    //   // ...
    //   await t.commit();
    // } catch (err) {
    //   t.rollback();
    //   return Promise.reject(err); // 如果不抛出具体错误，日志和返回的message和stack都会是模糊的
    // }
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
