import { Exclude, Expose } from 'class-transformer';
import { IsNotEmpty, IsOptional } from 'class-validator';

/**
 * 创建租户入参
 */
export class PostTenantReqDto {
  @IsNotEmpty()
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

/**
 * 获取租户出参
 */
@Exclude()
export class GetTenantRetDto {
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

/**
 * 修改租户入参
 */
export class PutTenantReqDto {
  // 两个配合表示可选，但如果添了，不能为空
  // 如果只有一个@IsNotEmpty()，表示必填项
  @IsOptional()
  @IsNotEmpty()
  tenantName: string;
  @IsOptional()
  @IsNotEmpty()
  contactName: string;
  @IsOptional()
  @IsNotEmpty()
  contactMobile: string;
  @IsOptional()
  @IsNotEmpty()
  contactEmail: string;
  @IsOptional()
  remark: string;
  // 使用Exclude()，可以强行忽略某个参数，比如一些敏感信息不开放修改
  @Exclude()
  deleteFlag: boolean;
  // 不属于该类的参数，会被自动无视
}

