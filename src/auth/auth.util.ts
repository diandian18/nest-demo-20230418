/**
 * auth:access_token:${accessToken} -> user
 */
export function genRedisAccessTokenKey(accessToken: string) {
  return `auth:access_token:${accessToken}`;
}

/**
 * auth:refresh_token:${refreshToken} -> user
 */
export function genRedisRefreshTokenKey(refreshToken: string) {
  return `auth:refresh_token:${refreshToken}`;
}

/**
 * auth:userId:{userId} -> { accessToken, refreshToken }
 */
export function genRedisAuthUserIdKey(userId: number) {
  return `auth:userId:${userId}`;
}
