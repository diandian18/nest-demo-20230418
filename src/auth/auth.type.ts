import { UserRetDto } from '@/user/user.dto';

export interface JwtPayload extends UserRetDto {
  timestamp: number;
}
