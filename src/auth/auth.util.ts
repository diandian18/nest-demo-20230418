/**
 * auth:access_token:${accessToken} -> user
 */
export function getRedisAccessTokenKey(accessToken: string) {
  return `auth:access_token:${accessToken}`;
}

/**
 * auth:refresh_token:${refreshToken} -> user
 */
export function getRedisRefreshTokenKey(refreshToken: string) {
  return `auth:refresh_token:${refreshToken}`;
}

/**
 * auth:userId:{userId} -> { accessToken, refreshToken }
 */
export function getRedisAuthUserIdKey(userId: number) {
  return `auth:userId:${userId}`;
}
