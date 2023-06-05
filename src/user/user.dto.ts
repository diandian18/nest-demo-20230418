import { Exclude, Expose } from 'class-transformer';
import { IsArray, IsNumber, IsString } from 'class-validator';

export class PhotoDto {
  @IsString()
  url: string;
}

export class UserDto {
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
 * login接口的返回dto
 * @Exclude()在顶部意味着会排除没有@Expose()装饰的所有字段
 */
@Exclude()
export class PostLoginRetDto {
  @Expose()
  userAccount: string;
  @Expose()
  userId: number;
  @Expose()
  @IsNumber()
  accessToken: string;
}
