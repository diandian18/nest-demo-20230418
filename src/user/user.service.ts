import { AuthService } from '@/auth/auth.service';
import StatusCodeEnum from '@/common/enums/StatusCodeEnum';
import { BusinessException } from '@/common/utils/businessException';
import genResponse from '@/common/utils/genResponse';
import { genId } from '@/common/utils/number';
import { genRandomNumber } from '@/common/utils/string';
import { isEnvTrue } from '@/common/utils/type';
import { ConfigService } from '@/config/config.service';
import { RoleService } from '@/role/role.service';
import { TenantModel } from '@/tenant/tenant.model';
import { TransactionOpts } from '@/types';
import { UserTenantRoleService } from '@/user-tenant-role/user-tenant-role.service';
import { Injectable, Scope } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { plainToClass, plainToInstance } from 'class-transformer';
// import { validate } from 'class-validator';
import { Sequelize } from 'sequelize-typescript';
// import {InjectRepository} from '@nestjs/typeorm';
// import {DataSource, Repository} from 'typeorm';
import { GetMineResDto, PostLoginReqDto, PostLoginRetDto, PostRegisterReqDto, PostSwitchTenantReqDto, PutResetPasswordReqDto, PutUserReqDto, RedisTokenUserDto, UserDto2 } from './user.dto';
import { Photo, UserModel } from './user.model';
import { UserType } from './user.types';
// import {User} from './user.entity';
import * as bcrypt from 'bcrypt';

@Injectable({ scope: Scope.REQUEST })
export class UserService {
  constructor(
    // redis
    // private redisService: RedisService,

    // axios
    // private httpService: HttpService,

    // typeorm版本
    // @InjectRepository(User)
    // private userRepository: Repository<User>,
    // private dataSource: DataSource,

    // sequelize版本
    @InjectModel(UserModel)
    private userModel: typeof UserModel,
    @InjectModel(Photo)
    private photoModel: typeof Photo,
    private sequelize: Sequelize,
    private authService: AuthService,
    private configService: ConfigService,
    private userTenantRoleService: UserTenantRoleService,
    private roleService: RoleService,
  ) {}

  async findAll() {
    // typeorm版本
    // return this.userRepository.find();
    // sequelize版本
    const users = await this.userModel.findAll({
      include: [{ model: Photo }],
      // attributes: {
      //   exclude: ['password'],
      // },
    });
    // await this.httpService.axiosRef.get<{a: string}>('http://localhost:3000/cat');
    // // @ts-ignore
    // xx.a();
    // ：
    return users;
  }

  async findOne(userId: number) {
    // typeorm版本
    // return this.userRepository.findOneBy({ id });
    // sequelize版本
    const user = await this.userModel.findOne({
      where: {
        userId,
      },
    });
    return user;
  }

  async remove(id: number) {
    // typeorm版本
    // await this.userRepository.delete(id);
    // sequelize版本
    const user = await this.findOne(id);
    await user.destroy();
  }

  // typeorm 版本
  // async createMany(users: UserDto[]) {
  //   // create
  //   const queryRunner = this.dataSource.createQueryRunner();
  //   // connect
  //   await queryRunner.connect();
  //   // start
  //   await queryRunner.startTransaction();

  //   try {
  //     // for (let i = 0; i < users.length; i++) {
  //     //   console.log(users[i]);
  //     //   // save
  //     //   await queryRunner.manager.save(this.userRepository.create(users[i]));
  //     // }
  //     await this.dataSource.transaction(async manager => {
  //       for (let i = 0; i < users.length; i++) {
  //         const user = users[i];
  //         const userId = parseInt((Math.random() * 100000).toFixed(0));
  //         const toSaveUsers = {
  //           ...user,
  //           photos: user.photos.map(photo => ({
  //             ...photo,
  //             id: parseInt((Math.random() * 100000).toFixed(0)),
  //             userId,
  //           })),
  //           id: userId,
  //           isActive: true,
  //         };
  //         await manager.save(this.userRepository.create(toSaveUsers));
  //       }
  //     });
  //     // commit
  //     await queryRunner.commitTransaction();
  //   } catch (err) {
  //     console.log('[UserService] createMany - catch: ', err);
  //     await queryRunner.rollbackTransaction();
  //     return Promise.reject(err);
  //   } finally {
  //     console.log('[UserService] createMany - finally');
  //     await queryRunner.release();
  //   }
  // }

  async createMany(users: UserDto2[]) {
    await this.sequelize.transaction(async (transaction) => {
      const transactionOpt = { transaction };

      for (let i = 0; i < users.length; i++) {
        const user = users[i];
        const userId = genRandomNumber();
        const toSavePhotos = user.photos.map((photo) => ({
          photoId: genRandomNumber(),
          userId,
          url: photo.url,
        }));
        const toSaveUsers = {
          userId,
          userAccount: user.userAccount,
          userPassword: user.userPassword,
          isActive: true,
        };
        console.log(toSaveUsers);
        console.log(toSavePhotos);
        await this.userModel.create(toSaveUsers, transactionOpt);
        await this.photoModel.bulkCreate(toSavePhotos, transactionOpt);
      }
    });
  }

  async updateOne(userId: number) {
    await this.userModel.update(
      {
        username: 'xxx', // 测试updated_time被自动更新
      },
      { where: { userId } },
    );
  }

  async postRegister(registerDto: PostRegisterReqDto) {
    const { userAccount, userPassword } = registerDto;
    const userDb = await this.userModel.findOne({
      where: { userAccount },
    });
    if (userDb) {
      throw new BusinessException(genResponse.fail(StatusCodeEnum.ACCOUNT_ALREADY_EXIST)); 
    }
    const hashedUserPassword = await bcrypt.hash(userPassword, 10);
    const userId = await genId();
    const toSaveUser = {
      userId,
      userType: UserType.PERSONAL,
      userAccount,
      userPassword: hashedUserPassword,
      isActive: true,
    };
    await this.userModel.create(toSaveUser);
  }

  async postLogin(loginDto: PostLoginReqDto) {
    const { userAccount, userPassword } = loginDto;
    const userDb = await this.userModel.findOne({
      where: { userAccount },
      include: [TenantModel, Photo],
    });

    // 账户不存在或者密码不匹配
    if (!userDb || !await bcrypt.compare(userPassword, userDb.userPassword)) {
      throw new BusinessException(genResponse.fail(StatusCodeEnum.PASS_WRONG));
    }
    
    // 登录第一个tenant，没有就返回0代表个人
    const tenantId = userDb.tenants?.[0]?.tenantId ?? 0;
    const { roleId } = await this.userTenantRoleService.findRoleByUserIdTenantId(userDb.userId, tenantId);
    const permissions = await this.roleService.getPermissionsByRoleId(roleId);

    // 生成和保存token
    const redisUser = {
      ...plainToClass(RedisTokenUserDto, userDb),
      tenantId,
      roleId,
      permissions,
    }
    const tokenObj = await this.authService.genToken(redisUser, {
      replace: isEnvTrue(
        this.configService.get('LOGIN_REPLACE'),
      ),
    });

    // 根据PostLoginRetDto的定义，使用plainToInstance得到要返回的值 (这里排除了userPassword isActive等字段)
    const retUser = plainToInstance(PostLoginRetDto, {
      ...redisUser,
      ...tokenObj,
    });

    // 可以校验
    // const errors = await validate(retUser);
    // console.log(errors);

    return retUser;
  }

  async postRefreshToken(refreshToken: string) {
    const userDto = await this.authService.getUserRetDtoByRefreshTokenInRedis(refreshToken);

    if (!userDto) {
      throw new BusinessException(
        genResponse.fail(StatusCodeEnum.REFRESH_TOKEN_EXPIRED),
      );
    }

    // replace模式下，会删除原token
    return await this.authService.genToken(userDto, {
      replace: isEnvTrue(
        this.configService.get('LOGIN_REPLACE'),
      ),
    });
  }

  async postLogout(user: RedisTokenUserDto) {
    await this.authService.removeToken(user, {
      replace: isEnvTrue(
        this.configService.get('LOGIN_REPLACE'),
      ),
    });
  }
  
  async putResetPassword(user: RedisTokenUserDto, putResetPasswordReqDto: PutResetPasswordReqDto) {
    const { userId } = user;
    const { oldPassword, newPassword } = putResetPasswordReqDto;
    const userDb = await this.userModel.findOne({
      where: { userId },
    });
    if (!await bcrypt.compare(oldPassword, userDb.userPassword)) {
      throw new BusinessException(genResponse.fail(StatusCodeEnum.RESET_OLD_PASS_WRONG));
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    this.userModel.update({
      userPassword: hashedNewPassword,
    }, {
      where: { userId },
    });
  }

  async putUser(userId: number, user: PutUserReqDto) {
    await this.sequelize.transaction(async (transaction) => {
      const transactionOpt = { transaction };
      await this.modelPutUser(userId, user, transactionOpt); 
    });
  }

  public async modelPutUser(userId: number, user: PutUserReqDto, transactionOpt: TransactionOpts) {
    const { photos, userType } = user;
    await this.userModel.update({
      userType,
    }, {
      where: { userId },
      ...transactionOpt,
    });
    if (photos) {
      // 删除userId下所有原photo
      await this.photoModel.destroy({
        where: { userId },
        ...transactionOpt,
      });
      
      // 新增userId下新photo
      const toSavePhotos = await Promise.all((photos ?? []).map(async ({ url = '' }) => {
        return {
          photoId: await genId(),
          url,
          userId,
        };
      }));
      await this.photoModel.bulkCreate(toSavePhotos, transactionOpt);
    }
  }

  async getMine(user: RedisTokenUserDto) {
    const { userId, userAccount, tenantId } = user;
    const userDb = await this.userModel.findOne({
      where: { userId },
      include: [TenantModel],
    });
    const { roleId } = await this.userTenantRoleService.findRoleByUserIdTenantId(userId, tenantId);
    const permissions = await this.roleService.getPermissionsByRoleId(roleId);
    const ret = plainToInstance(GetMineResDto, {
      ...userDb,
      userId,
      userAccount,
      tenantId,
      roleId,
      permissions,
    });
    return ret;
  }

  /**
   * 切换租户
   */
  async postSwitchTenant(user: RedisTokenUserDto, postSwitchTenantReqDto: PostSwitchTenantReqDto) {
    const { tenantId } = postSwitchTenantReqDto;
    const { tenants, userId } = user;
    if (+tenantId !== 0 && !tenants.some(item => parseInt(item.tenantId) === tenantId)) {
      throw new BusinessException(
        genResponse.fail(
          StatusCodeEnum.SWITCHING_TENANT_NOT_FOUND,
        ),
      ); 
    }

    const { roleId } = await this.userTenantRoleService.findRoleByUserIdTenantId(userId, tenantId);
    const permissions = await this.roleService.getPermissionsByRoleId(roleId);
    
    const redisUser = {
      ...user,
      // 个人用户都将是0
      tenantId,
      roleId,
      permissions,
    }
    const tokenObj = await this.authService.genToken(redisUser, {
      replace: isEnvTrue(
        this.configService.get('LOGIN_REPLACE'),
      ),
    });
    const retUser = plainToInstance(PostLoginRetDto, {
      ...redisUser,
      ...tokenObj,
    });

    return retUser;
  }
}

