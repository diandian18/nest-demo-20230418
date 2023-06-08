import { SetMetadata } from '@nestjs/common';
import { NO_AUTH_REQUIRED_KEY } from './auth.const';

/**
 * 该接口不需要auth
 */
export function Public() {
  return SetMetadata(NO_AUTH_REQUIRED_KEY, true);
}
