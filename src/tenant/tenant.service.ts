// import { getRedisAccessTokenKey, getRedisRefreshTokenKey } from '@/auth/auth.util';
import { genId } from '@/common/utils/number';
import { enumer } from '@/common/utils/type';
import { RoleService } from '@/role/role.service';
import { UserTenantRoleService } from '@/user-tenant-role/user-tenant-role.service';
import { UserTenantService } from '@/user-tenant/user-tenant.service';
import { RedisTokenUserDto } from '@/user/user.dto';
import { UserService } from '@/user/user.service';
import { UserType } from '@/user/user.types';
// import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Injectable, Scope } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
// import { Cache } from 'cache-manager';
import { plainToInstance } from 'class-transformer';
import { Sequelize } from 'sequelize-typescript';
import { GetTenantRetDto, PostTenantReqDto, PutTenantReqDto } from './tanant.dto';
import { TenantModel } from './tenant.model';
import { TenantStatus } from './tenant.type';

@Injectable({ scope: Scope.REQUEST })
export class TenantService {
  constructor(
    private sequelize: Sequelize,
    @InjectModel(TenantModel)
    private tenantModel: typeof TenantModel,
    //@Inject(CACHE_MANAGER)
    //private catchManager: Cache,
    private roleService: RoleService,
    private userService: UserService,
    private userTenantService: UserTenantService,
    private userTenantRoleService: UserTenantRoleService,
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
      // 新增租户表记录
      await this.tenantModel.create(toSaveTenant, transactionOpts);
      // 新增用户-租户关联表记录
      await this.userTenantService.createOne(user.userId, tenantId, transactionOpts);
      // 基于新的租户，创建一个管理员角色
      const roleId = await this.roleService.createAdminRole(user, tenantId, transactionOpts);
      // 把角色赋给租户的用户
      await this.userTenantRoleService.createOne(user.userId, tenantId, roleId, transactionOpts);
      // 更新用户信息
      await this.userService.modelPutUser(user.userId, {
        userType: UserType.TENANT,
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
}

