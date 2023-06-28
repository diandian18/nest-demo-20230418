import { IsNotEmpty, IsOptional } from 'class-validator';

export enum RoleStatus {
  'DISABLED',
  'ENABLED',
}

export class PostRoleReqDto {
  // roleId: number;
  @IsNotEmpty()
  roleName: string;
  // tenantId: number;
  // roleStatus: RoleStatus;
  // editableFlag: BlEnum;
  @IsOptional()
  remark: string;
}
