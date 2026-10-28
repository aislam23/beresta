/** Приводит российский номер к виду +7XXXXXXXXXX. Возвращает null, если это не номер. */
export function normalizePhone(raw: string): string | null {
  const digits = raw.replace(/\D/g, '');
  let national: string;
  if (digits.length === 11 && (digits[0] === '7' || digits[0] === '8')) national = digits.slice(1);
  else if (digits.length === 10) national = digits;
  else return null;
  // мобильные начинаются с 9, городские с 3, 4 или 8
  if (!/^[3489]/.test(national)) return null;
  return `+7${national}`;
}
