import { getRedisAccessTokenKey, getRedisRefreshTokenKey } from '@/auth/auth.util';
import { genId } from '@/common/utils/number';
import { enumer } from '@/common/utils/type';
import { RedisTokenUserDto } from '@/user/user.dto';
import { UserModel, UserTenantModel } from '@/user/user.model';
import { UserType } from '@/user/user.types';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable, Scope } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Cache } from 'cache-manager';
import { plainToInstance } from 'class-transformer';
import { Sequelize } from 'sequelize-typescript';
import { GetTenantRetDto, PostSwitchTenantReqDto, PostTenantReqDto, PutTenantReqDto } from './tanant.dto';
import { TenantModel } from './tenant.model';
import { TenantStatus } from './tenant.type';

@Injectable({ scope: Scope.REQUEST })
export class TenantService {
  constructor(
    private sequelize: Sequelize,
    @InjectModel(TenantModel)
    private tenantModel: typeof TenantModel,
    @InjectModel(UserModel)
    private userModel: typeof UserModel,
    @InjectModel(UserTenantModel)
    private userTenantModel: typeof UserTenantModel,
    @Inject(CACHE_MANAGER)
    private catchManager: Cache,
  ) {}
  async postTenant(user: RedisTokenUserDto, postTenantDto: PostTenantReqDto) {
    // 推荐这种写法，比较简洁，另一种写法需要手动抛错
    await this.sequelize.transaction(async (transaction) => {
      const transactionOpts = { transaction };
      const tenantId = await genId();
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
        userType: UserType.TENANT,
      }, {
        where: {
          userId: user.userId,
        },
        ...transactionOpts,
      });
      await this.userTenantModel.create({
        userId: user.userId,
        tenantId,
      }, transactionOpts);
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
    const tenantRet = plainToInstance(GetTenantRetDto, tenantDb);
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

  async postSwitchTenant(user: RedisTokenUserDto, postSwitchTenantReqDto: PostSwitchTenantReqDto) {
    const { accessToken, refreshToken, tenantId } = postSwitchTenantReqDto;
    const accessTokenKey = getRedisAccessTokenKey(accessToken);
    const refreshTokenKey = getRedisRefreshTokenKey(refreshToken)
    await this.catchManager.set(accessTokenKey, JSON.stringify({
      ...user,
      currentTenantId: tenantId,
    }));
    await this.catchManager.set(refreshTokenKey, JSON.stringify({
      ...user,
      currentTenantId: tenantId,
    }));
  }
}

