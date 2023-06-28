import { Exclude, Expose } from 'class-transformer';
import { IsArray, IsString } from 'class-validator';

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

/**
 * 可暴露的用户信息的返回dto
 */
@Exclude()
export class UserRetDto {
  @Expose()
  userAccount: string;
  @Expose()
  userId: number;
  @Expose()
  photos: PhotoDto[];
  @Expose()
  tenantId: number;
}

/**
 * login接口的返回dto
 * @Exclude()在顶部意味着会排除没有@Expose()装饰的所有字段
 */
@Exclude()
export class PostLoginRetDto extends UserRetDto {
  @Expose()
  accessToken: string;
  @Expose()
  refreshToken: string;
  @Expose()
  expiration: number;
}

@Exclude()
export class PutUserReqDto {
  @Expose()
  photos?: PhotoDto[];
}

