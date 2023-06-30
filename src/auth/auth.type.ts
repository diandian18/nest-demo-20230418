import { RedisTokenUserDto } from '@/user/user.dto';

export interface JwtPayload extends RedisTokenUserDto {
  timestamp: number;
}
