import { describe, expect, it } from 'vitest';
import { toPaise } from './money';

describe('toPaise', () => {
  it('converts rupees to paise exactly', () => {
    expect(toPaise('12.50')).toBe(1250);
    expect(toPaise('12.5')).toBe(1250);
    expect(toPaise('0.1')).toBe(10);
  });

  it('rejects invalid amounts', () => {
    expect(() => toPaise('abc')).toThrow();
    expect(() => toPaise('-5')).toThrow();
    expect(() => toPaise('1.234')).toThrow();
  });
});