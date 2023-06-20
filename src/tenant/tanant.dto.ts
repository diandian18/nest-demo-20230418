import { Exclude, Expose } from 'class-transformer';
import { IsNotEmpty, IsOptional } from 'class-validator';

/**
 * 创建租户入参
 */
export class PostTenantReqDto {
  @IsNotEmpty()
  tenantName: string;
  @IsNotEmpty()
  contactName: string;
  @IsNotEmpty()
  contactMobile: string;
  @IsNotEmpty()
  contactEmail: string;
  @IsOptional()
  remark: string;
}

@Exclude()
export class GetTenantResDto {
  @Expose()
  tenantId: string;
  @Expose()
  tenantName: string;
  @Expose()
  contactName: string;
  @Expose()
  contactMobile: string;
  @Expose()
  contactEmail: string;
  @Expose()
  remark: string;
}

export class PutTenantReqDto {
  @IsOptional()
  tenantName: string;
  @IsOptional()
  contactName: string;
  @IsOptional()
  contactMobile: string;
  @IsOptional()
  contactEmail: string;
  @IsOptional()
  remark: string;
}

