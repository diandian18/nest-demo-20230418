import { Injectable, Scope } from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {DataSource, Repository} from 'typeorm';
import {RedisService} from '../redis/redis.service';
import {LoginDto, registerDto, UserDto} from './user.dto';
import {User} from './user.entity';

@Injectable({ scope: Scope.REQUEST })
export class UserService {
  constructor(
    private redisService: RedisService,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private dataSource: DataSource,
  ) {}

  findAll() {
    return this.userRepository.find();
  }

  findOne(id: number) {
    return this.userRepository.findOneBy({ id });
  }

  async remove(id: number) {
    await this.userRepository.delete(id);
  }

  async createMany(users: UserDto[]) {
    // create
    const queryRunner = this.dataSource.createQueryRunner();
    // connect
    await queryRunner.connect();
    // start
    await queryRunner.startTransaction();

    try {
      // for (let i = 0; i < users.length; i++) {
      //   console.log(users[i]);
      //   // save
      //   await queryRunner.manager.save(this.userRepository.create(users[i]));
      // }
      await this.dataSource.transaction(async manager => {
        for (let i = 0; i < users.length; i++) {
          const user = users[i];
          const userId = parseInt((Math.random() * 100000).toFixed(0));
          const toSaveUsers = {
            ...user,
            photos: user.photos.map(photo => ({
              ...photo,
              id: parseInt((Math.random() * 100000).toFixed(0)),
              user: userId,
            })),
            id: userId,
            isActive: true,
          };
          await manager.save(this.userRepository.create(toSaveUsers));
        }
      });
      // commit
      await queryRunner.commitTransaction();
    } catch (err) {
      console.log('[UserService] createMany - catch: ', err);
      await queryRunner.rollbackTransaction();
      return Promise.reject(err);
    } finally {
      console.log('[UserService] createMany - finally');
      await queryRunner.release();
    } 
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

