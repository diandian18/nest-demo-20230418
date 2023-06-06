import StatusCodeEnum from '@/common/enums/StatusCodeEnum';
import { JwtPayload } from '@/common/types/auth.type';
import { genJwtRedisKey } from '@/common/utils/auth.util';
import { BusinessException } from '@/common/utils/businessException';
import genResponse from '@/common/utils/genResponse';
import { genRandomNumber } from '@/common/utils/string';
import { ConfigService } from '@/config/config.service';
import { HttpService } from '@nestjs/axios';
import { Injectable, Scope } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/sequelize';
import { plainToInstance } from 'class-transformer';
import { Sequelize } from 'sequelize-typescript';
// import {InjectRepository} from '@nestjs/typeorm';
// import {DataSource, Repository} from 'typeorm';
import { RedisService } from '../redis/redis.service';
import {
  PostLoginReqDto,
  PostLoginRetDto,
  PostRegisterReqDto,
  UserDto,
} from './user.dto';
import { Photo, User } from './user.model';
// import {User} from './user.entity';

@Injectable({ scope: Scope.REQUEST })
export class UserService {
  constructor(
    // redis
    private redisService: RedisService,

    // axios
    private httpService: HttpService,

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

    // jwt
    private jwtService: JwtService,

    private configService: ConfigService,
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

  async createMany(users: UserDto[]) {
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

    if (userPassword !== user.dataValues?.userPassword) {
      throw new BusinessException(genResponse.fail(StatusCodeEnum.PASS_WRONG));
    }

    // 生成jwt
    const jwtPayload: JwtPayload = { userId: user.userId };
    const accessToken = await this.jwtService.signAsync(jwtPayload);

    // accessToken保存在redis
    this.redisService.cache.set(
      genJwtRedisKey(accessToken),
      user.userId,
      +this.configService.get('JWT_TTL'),
    );

    // 根据PostLoginRetDto的定义，使用plainToInstance得到要返回的值 (这里排除了userPassword isActive等字段)
    const retUser = plainToInstance(PostLoginRetDto, {
      ...user.dataValues,
      accessToken,
    });

    // 可以校验
    // const errors = await validate(retUser);
    // console.log(errors);

    return retUser;
  }
}
