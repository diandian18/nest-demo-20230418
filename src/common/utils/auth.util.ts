export function genRedisAccessTokenKey(accessToken: string) {
  return `auth:access_token:${accessToken}`;
}

export function genRedisRefreshTokenKey(refreshToken: string) {
  return `auth:refresh_token:${refreshToken}`;
}

export function genRedisAuthUserIdKey(userId: number) {
  return `auth:userId:${userId}`; // 映射accessToken
}
