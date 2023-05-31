export function isLocal() {
  return process.env.NODE_ENV === 'local';
}

export const isEnvLocal = process.env.NODE_ENV === 'local';

