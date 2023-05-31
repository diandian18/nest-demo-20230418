import {IsArray, IsNumber, IsString} from 'class-validator';

export class PhotoDto {
  @IsString()
  url: string;
}

export class UserDto {
  @IsString()
  firstName: string;
  @IsString()
  lastName: string;
  @IsArray()
  photos: PhotoDto[];
  @IsNumber()
  password: string;
}

export class registerDto {
  @IsString()
  userAccount: string;
  @IsString()
  userPassword: string;
  userRePassword: string;
}

export class LoginDto {
  @IsString()
  userAccount: string;
  @IsString()
  userPassword: string;
}

