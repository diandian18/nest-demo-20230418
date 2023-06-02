import { Column, CreatedAt, Model, UpdatedAt } from 'sequelize-typescript';

// @thomasmikava You're using sequelize.sync in order to create the database tables, right? I would recommend using migrations instead. There you could set up what you want and you could omit setting defaultValue

export class BaseModel extends Model {
  @Column
  creatorId: number;

  @CreatedAt
  createdTime: Date;

  @Column
  updaterId: number;

  @UpdatedAt
  updatedTime: Date;
}

export function mergeExcludeFields(excludeFileds: string[]) {
  const baseExcludeFields = ['creatorId', 'createdTime', 'updaterId', 'updatedTime'];
  return [
    ...excludeFileds,
    ...baseExcludeFields,
  ];
}

