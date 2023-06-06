export function genJwtRedisKey(keyPayload: string | number) {
  return `auth:access_token:${keyPayload}`;
}
