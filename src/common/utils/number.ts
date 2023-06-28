import { customAlphabet } from 'nanoid/async';

export async function genId() {
  const ret = await customAlphabet('1234567890', 15)();
  return parseInt(ret);
}
