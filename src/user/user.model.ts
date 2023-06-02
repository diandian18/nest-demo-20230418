// import {Model} from '@/common/Model';
import {BaseModel} from '@/common/sequelize';
import {Model, BelongsTo, Column, DefaultScope, ForeignKey, HasMany, Table, CreatedAt, UpdatedAt} from "sequelize-typescript";

@DefaultScope(() => ({
  attributes: { exclude: ['password'/*, 'createdAt', 'updatedAt'*/] },
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
  attributes: { exclude: ['userId'] },
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

