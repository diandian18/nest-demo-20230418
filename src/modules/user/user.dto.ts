import {IsString} from 'class-validator';

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

