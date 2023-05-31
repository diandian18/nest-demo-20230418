// import {Model} from '@/common/Model';
import {Model, BelongsTo, Column, DefaultScope, ForeignKey, HasMany, Table} from "sequelize-typescript";

@DefaultScope(() => ({
  attributes: { exclude: ['password'] },
}))
@Table({
  tableName: 'user',
  timestamps: false,
})
export class User extends Model {
  // @PrimaryKey
  @Column({ primaryKey: true })
  userId: number;

  @Column
  firstName: string;

  @Column
  lastName: string;

  @Column({ defaultValue: true })
  isActive: boolean;

  @HasMany(() => Photo)
  photos: Photo[];

  @Column
  password: string;
}

@DefaultScope(() => ({
  attributes: { exclude: ['userId'] },
}))
@Table({
  tableName: 'photo',
  timestamps: false,
})
export class Photo extends Model {
  // @PrimaryKey
  @Column({ primaryKey: true })
  photoId: number;

  @Column
  @ForeignKey(() => User)
  userId: number; // 关联User

  @BelongsTo(() => User)
  user: User;

  @Column
  url: string;
}

