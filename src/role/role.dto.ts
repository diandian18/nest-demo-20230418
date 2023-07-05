import { Exclude, Expose } from 'class-transformer';
import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { PermissionType } from './role.type';

export enum RoleStatus {
  'DISABLED',
  'ENABLED',
}

export class PostRoleReqDto {
  @IsOptional()
  tenantId?: number;
  // roleId: number;
  @IsNotEmpty()
  roleName: string;
  // roleStatus: RoleStatus;
  // editableFlag: BlEnum;
  @IsOptional()
  remark: string;
}

@Exclude()
export class GetPermissionsResDto {
  @Expose()
  children: GetPermissionsResDto[];
  @Expose()
  permissionId: number;
  @Expose()
  parentId: number;
  @Expose()
  hasChildren: BlEnum;
  @Expose()
  permissionName: string;
  @Expose()
  permissionCode: string;
  @Expose()
  permissionType: PermissionType;
  @Expose()
  permissionLevel: number;
  @Expose()
  sequence: number;
  @Expose()
  remark: string;
  @Expose()
  deleteFlag: BlEnum;
}

export class PutRolePermissionReqDto {
  @IsArray()
  permissionIdList: number[];
  @IsString()
  @IsOptional()
  remark?: string;
}

