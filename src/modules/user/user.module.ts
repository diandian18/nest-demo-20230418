import { Module } from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import { UserController } from './user.controller';
import {Photo, User} from './user.entity';
import { UserService } from './user.service';
import {UserSubscriber} from './user.subscriber';

@Module({
  imports: [TypeOrmModule.forFeature([User, Photo])], // 或forFeature([UserSchema]) Nest 允许您在任何需要实体的地方使用 EntitySchema 实例
  controllers: [UserController],
  providers: [UserService, UserSubscriber],
  // 导出后，其他import User的模块可以使用@InjectRepository(User)
  exports: [TypeOrmModule],
})

export class UserModule {}

