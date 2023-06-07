import StatusCodeEnum from '@/common/enums/StatusCodeEnum';
import { JwtPayload } from '@/common/types/auth.type';
import { genRedisAccessTokenKey, genRedisAuthUserIdKey, genRedisRefreshTokenKey } from '@/common/utils/auth.util';
import { BusinessException } from '@/common/utils/businessException';
import genResponse from '@/common/utils/genResponse';
import { genRandomNumber } from '@/common/utils/string';
import { ConfigService } from '@/config/config.service';
// import { HttpService } from '@nestjs/axios';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable, Scope } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/sequelize';
import { Cache } from 'cache-manager';
import { plainToInstance } from 'class-transformer';
import { Sequelize } from 'sequelize-typescript';
// import {InjectRepository} from '@nestjs/typeorm';
// import {DataSource, Repository} from 'typeorm';
// import { RedisService } from '../redis/redis.service';
import {
  PostLoginReqDto,
  PostLoginRetDto,
  PostRegisterReqDto,
  UserDto2,
  UserDto,
} from './user.dto';
import { Photo, User } from './user.model';
// import {User} from './user.entity';

@Injectable({ scope: Scope.REQUEST })
export class UserService {
  constructor(
    // redis
    // private redisService: RedisService,

    @Inject(CACHE_MANAGER)
    private cacheManager: Cache,

    // axios
    // private httpService: HttpService,

    // typeorm版本
    // @InjectRepository(User)
    // private userRepository: Repository<User>,
    // private dataSource: DataSource,

    // sequelize版本
    @InjectModel(User)
    private userModel: typeof User,
    @InjectModel(Photo)
    private photoModel: typeof Photo,
    private sequelize: Sequelize,

    private configService: ConfigService,

    // jwt
    private jwtService: JwtService,
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
    const userId = genRandomNumber();
    const toSaveUser = {
      userId,
      userAccount,
      userPassword,
      isActive: true,
    };
    await this.userModel.create(toSaveUser);
  }

  async postLogin(loginDto: PostLoginReqDto) {
    const { userAccount, userPassword } = loginDto;
    const user = await this.userModel.findOne({
      where: {
        userAccount,
      },
    });

    // 账户不存在或者密码不匹配
    if (!user || userPassword !== user.dataValues?.userPassword) {
      throw new BusinessException(genResponse.fail(StatusCodeEnum.PASS_WRONG));
    }

    // 生成和保存token
    const userInfo = plainToInstance(UserDto, user.dataValues);
    const tokenObj = await this.genToken(userInfo, { replace: false });

    // 根据PostLoginRetDto的定义，使用plainToInstance得到要返回的值 (这里排除了userPassword isActive等字段)
    const retUser = plainToInstance(PostLoginRetDto, {
      ...user.dataValues,
      ...tokenObj,
    });

    // 可以校验
    // const errors = await validate(retUser);
    // console.log(errors);

    return retUser;
  }

  async refreshToken(refreshToken: string) {
    const redisRefreshTokenKey = genRedisRefreshTokenKey(refreshToken);
    const redisRefreshTokenPayload = await this.cacheManager.get(redisRefreshTokenKey);
    const userId = redisRefreshTokenPayload;

    if (!redisRefreshTokenPayload) {
      throw new BusinessException(
        genResponse.fail(StatusCodeEnum.REFRESH_TOKEN_EXPIRED),
      );
    }

    const userModel = await this.userModel.findOne({
      where: { userId },
    });
    const userDto = plainToInstance(UserDto, userModel);

    // replace模式下，会删除原token
    return await this.genToken(userDto, { replace: false });
  }

  /**
   * 生成和保存accessToken refreshToken expiration
   * replace模式下，会删除该用户的原token，即同时只能有一个token
   */
  private async genToken(
    user: UserDto,
    opts?: { replace?: boolean; refreshToken?: string },
  ) {
    const { replace = false } = opts ?? {};
    // 生成jwt
    const jwtPayload: JwtPayload = { ...user, timestamp: Date.now() };
    const accessToken = await this.jwtService.signAsync(jwtPayload);
    const refreshToken = await this.jwtService.signAsync({
      ...jwtPayload,
      isRefreshToken: true,
    });
    const accessTokenTTL = +this.configService.get('JWT_ACCESS_TOKEN_TTL');
    const refreshTokenTTL = +this.configService.get('JWT_REFRESH_TOKEN_TTL');
    const expiration = Date.now() + refreshTokenTTL * 1000;

    // 生成redis键值对
    const redisAccessTokenKey = genRedisAccessTokenKey(accessToken); // key格式: auth:access_token:{accessToken}
    const redisRefreshTokenKey = genRedisRefreshTokenKey(refreshToken);
    const redisTokenValue = user.userId;

    // 保存在redis
    const promises = [
      this.cacheManager.set(
        redisAccessTokenKey,
        redisTokenValue,
        accessTokenTTL, // 不会生效，似乎是bug
      ),
      this.cacheManager.set(
        redisRefreshTokenKey,
        redisTokenValue,
        refreshTokenTTL,
      ),
    ];

    // 如果同时只能有一个accessToken
    if (replace) {
      // 删除原token -> user
      const oldTokenJson = await this.cacheManager.get<string>(
        genRedisAuthUserIdKey(user.userId),
      );
      const {
        accessToken: oldAccessToken,
        refreshToken: oldRefreshToken
      } = JSON.parse(oldTokenJson ?? null) ?? {};

      if (oldAccessToken && oldRefreshToken) {
        promises.push(
          this.cacheManager.del(
            genRedisAccessTokenKey(oldAccessToken)
          ),
          this.cacheManager.del(
            genRedisRefreshTokenKey(oldRefreshToken)
          ),
        );
      }
      // 更新userId -> token
      promises.push(
        this.cacheManager.set(
          genRedisAuthUserIdKey(user.userId),
          JSON.stringify({
            accessToken,
            refreshToken,
          }),
          accessTokenTTL,
        ),
      );
    }

    await Promise.all(promises);

    return {
      accessToken,
      refreshToken,
      expiration,
    };
  }
}
