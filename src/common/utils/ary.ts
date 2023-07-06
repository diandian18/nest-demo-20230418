export function aryToMap<K, T>(ary: T[], key: string) {
  const map = new Map<K, T>();
  ary.forEach(item => {
    map.set(item[key], { ...item, children: [] });
  });
  return map;
}

