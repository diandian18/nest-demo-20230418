import {BaseModel, mergeExcludeFields} from '@/common/sequelize';
import {BelongsTo, Column, DefaultScope, ForeignKey, HasMany, Table} from "sequelize-typescript";

@DefaultScope(() => ({
  attributes: {
    exclude: mergeExcludeFields([/* 'userPassword' */]),
    // include 比 exclude 的优先级更高
    // include: ['password'],
  },
}))
@Table({
  tableName: 'user',
  // timestamps: false,
})
export class User extends BaseModel {
  @Column({ primaryKey: true })
  userId: number;

  @Column
  userAccount: string;

  @Column
  userPassword: string;

  @Column({ defaultValue: true })
  isActive: boolean;

  @HasMany(() => Photo)
  photo: Photo[];
}

@DefaultScope(() => ({
  attributes: { exclude: mergeExcludeFields(['userId']) },
}))
@Table({
  tableName: 'photo',
  // timestamps: false,
})
export class Photo extends BaseModel {
  @Column({ primaryKey: true })
  photoId: number;

  @Column
  url: string;

  @Column
  @ForeignKey(() => User)
  userId: number; // 关联User表

  @BelongsTo(() => User)
  user: User;
}

@DefaultScope(() => ({
  attributes: { exclude: mergeExcludeFields(['userId']) },
}))
@Table({
  tableName: 'user_info',
  // timestamps: false,
})
export class UserInfo extends BaseModel {
  @Column({ primaryKey: true })
  userInfoId: number;

  @Column
  nickname: string;

  @Column
  @ForeignKey(() => User)
  userId: number; // 关联User表

  @BelongsTo(() => User)
  user: User;
}

