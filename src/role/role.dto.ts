import { Exclude, Expose } from 'class-transformer';
import { IsNotEmpty, IsOptional } from 'class-validator';
import { PermissionType } from './role.type';

export enum RoleStatus {
  'DISABLED',
  'ENABLED',
}

export class PostRoleReqDto {
  // roleId: number;
  @IsNotEmpty()
  roleName: string;
  @IsOptional()
  tenantId?: number;
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

