import { describe, expect, it } from 'vitest';
import { formatINR, lineTotal, toPaise } from './money';

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


describe('lineTotal', () => {
  it('multiplies quantity by rate', () => {
    expect(lineTotal(2, toPaise('50'))).toBe(10000);
  });

  it('handles decimal quantities like 0.5 kg', () => {
    expect(lineTotal(0.5, toPaise('50'))).toBe(2500);
  });

  it('rounds to the nearest paisa', () => {
    expect(lineTotal(0.75, toPaise('33.33'))).toBe(2500);
  });
    it('rejects zero, negative, and invalid quantities', () => {
    expect(() => lineTotal(0, toPaise('50'))).toThrow();
    expect(() => lineTotal(-2, toPaise('50'))).toThrow();
    expect(() => lineTotal(Number.NaN, toPaise('50'))).toThrow();
  });
});