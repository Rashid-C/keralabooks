import { describe, expect, it } from 'vitest';
import { formatINR, toPaise } from './money';

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

describe('formatINR', () => {
  it('formats paise as Indian rupees', () => {
    expect(formatINR(toPaise('125000'))).toBe('₹1,25,000.00');
    expect(formatINR(toPaise('0.5'))).toBe('₹0.50');
  });
});