import {IsArray, IsString} from 'class-validator';
import {Photo} from './user.entity';

export class UserDto {
  @IsString()
  firstName: string;
  @IsString()
  lastName: string;
  @IsArray()
  photos: Photo[];
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

