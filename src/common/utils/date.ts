export function get2DigitDay() {
  return new Date().toLocaleDateString(undefined, {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
}

export function getNoSplit2DigitDay() {
  return get2DigitDay().replace(/\D/g, '');
}

