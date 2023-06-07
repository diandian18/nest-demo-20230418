import { UserDto } from '@/user/user.dto';

export interface JwtPayload extends UserDto {
  timestamp: number;
}
