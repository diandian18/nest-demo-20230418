// import {Model} from '@/common/Model';
import {BaseModel, mergeExcludeFields} from '@/common/sequelize';
import {Model, BelongsTo, Column, DefaultScope, ForeignKey, HasMany, Table} from "sequelize-typescript";

@DefaultScope(() => ({
  attributes: {
    exclude: mergeExcludeFields(['password']),
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
  firstName: string;

  @Column
  lastName: string;

  @Column({ defaultValue: true })
  isActive: boolean;

  @Column
  password: string;

  @HasMany(() => Photo)
  photos: Photo[];
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
  @ForeignKey(() => User)
  userId: number; // 关联User

  @Column
  url: string;

  @BelongsTo(() => User)
  user: User;
}

