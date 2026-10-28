import { describe, it, expect } from 'vitest';
import { normalizePhone } from '../../src/lib/phone';

describe('normalizePhone', () => {
  it.each([
    ['+7 900 123-45-67', '+79001234567'],
    ['8 (843) 000-12-12', '+78430001212'],
    ['7 900 123 45 67', '+79001234567'],
    ['9001234567', '+79001234567'],
    ['  +7(495)1234567 ', '+74951234567'],
  ])('%s → %s', (raw, expected) => {
    expect(normalizePhone(raw)).toBe(expected);
  });

  it.each([
    [''],
    ['12345'],
    ['+7 100 123-45-67'],
    ['+1 900 123 4567'],
    ['+7 900 123-45-678'],
    ['телефон'],
  ])('«%s» не номер', (raw) => {
    expect(normalizePhone(raw)).toBeNull();
  });
});
