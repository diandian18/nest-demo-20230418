import { Exclude, Expose, Type } from 'class-transformer';
import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { GetTenantRetDto } from '@/tenant/tanant.dto';
import { UserType } from './user.types';

@Exclude()
export class PhotoDto {
  @Expose()
  @IsString()
  url: string;
}

export class UserDto2 {
  @IsString()
  userAccount: string;
  @IsString()
  userPassword: string;
  @IsArray()
  photos: PhotoDto[];
}

export class PostRegisterReqDto {
  @IsString()
  userAccount: string;
  @IsString()
  userPassword: string;
}

export class PostLoginReqDto {
  @IsString()
  userAccount: string;
  @IsString()
  userPassword: string;
}

@Exclude()
export class GetMineResDto {
  @Expose()
  userAccount: string;
  @Expose()
  userId: number;
  @Expose()
  @Type(() => GetTenantRetDto) // 嵌套的对象需要用Type, 参见https://github.com/typestack/class-transformer#working-with-nested-objects
  tenants: GetTenantRetDto[];
  @Expose()
  tenantId: number; // 当前租户
  @Expose()
  roleId: number; // 当前租户下的角色
  @Expose()
  permissions: string[];
}

@Exclude()
export class RedisTokenUserDto extends GetMineResDto {}

/**
 * login接口的返回dto
 * @Exclude()在顶部意味着会排除没有@Expose()装饰的所有字段
 */
@Exclude()
export class PostLoginRetDto extends RedisTokenUserDto {
  @Expose()
  accessToken: string;
  @Expose()
  refreshToken: string;
  @Expose()
  expiration: number;
}

export class PutUserReqDto {
  @IsOptional()
  photos?: PhotoDto[];
  @IsOptional()
  userType?: UserType;
}

export class PostSwitchTenantReqDto {
  @IsNotEmpty()
  tenantId: number;
}

