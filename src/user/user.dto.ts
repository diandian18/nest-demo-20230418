import {IsArray, IsNumber, IsString} from 'class-validator';

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

export class RegisterDto {
  @IsString()
  userAccount: string;
  @IsString()
  userPassword: string;
}

export class LoginDto {
  @IsString()
  userAccount: string;
  @IsString()
  userPassword: string;
}

