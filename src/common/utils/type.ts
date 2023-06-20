/**
 * 把(0 | 1)，转换为布尔类型
 */
export function isTrue(val: 0 | 1) {
  return !!val;
}

/**
 * 把布尔类型，转换为(0 | 1)
 */
export function enumer(val: boolean): BlEnum {
  return val ? 1 : 0;
}

