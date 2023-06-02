import {HttpService} from '@nestjs/axios';
import { Injectable, Scope } from '@nestjs/common';
import {InjectModel} from '@nestjs/sequelize';
import {Sequelize} from 'sequelize-typescript';
// import {InjectRepository} from '@nestjs/typeorm';
// import {DataSource, Repository} from 'typeorm';
import {RedisService} from '../redis/redis.service';
import {LoginDto, registerDto, UserDto} from './user.dto';
import {Photo, User} from './user.model';
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
  ) {}

  async findAll() {
    // typeorm版本
    // return this.userRepository.find();
    // sequelize版本
    const users = await this.userModel.findAll({
      include: [{model: Photo}],
      // attributes: {
      //   exclude: ['password'],
      // },
    });
    // await this.httpService.axiosRef.get<{a: string}>('http://localhost:3000/cat');
    // @ts-ignore
    // xx.a();
    // ：
    return users; 
  }

  async findOne(userId: number) {
    // typeorm版本
    // return this.userRepository.findOneBy({ id });
    // sequelize版本
    return await this.userModel.findOne({
      where: {
        userId,
      },
    });
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
    await this.sequelize.transaction(async transaction => {
      const transactionOpt = { transaction };

      for (let i = 0; i < users.length; i++) {
        const user = users[i];
        const userId = parseInt((Math.random() * 100000).toFixed(0));
        const toSavePhotos = user.photos.map(photo => ({
          photoId: parseInt((Math.random() * 100000).toFixed(0)),
          userId,
          url: photo.url,
        }));
        const toSaveUsers = {
          userId,
          firstName: user.firstName,
          lastName: user.lastName,
          password: user.password,
          isActive: true,
        };
        console.log('toSaveUsers: ', toSaveUsers);
        await this.userModel.create(toSaveUsers, transactionOpt);
        await this.photoModel.bulkCreate(toSavePhotos, transactionOpt)
      } 
    }); 
  }

  async updateOne() {
    await this.userModel.update({
      lastName: 'xxx', // 测试updated_time被自动更新
    }, { where: { userId: 28620 } });  
  }

  register(registerDto: registerDto) {
      
  }

  async login(reqBody: LoginDto) {
    const { userAccount, userPassword } = reqBody;
    const token = this.genToken(userAccount, userPassword); 
    // @ts-ignore
    await this.redisService.cache.set(token, 1, { ttl: 2 * 60 * 60 });
  }

  genToken(userAccount: string, userPassword: string) {
    return `${userAccount}-${userPassword}`;
  }
}

