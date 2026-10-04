import { describe, expect, it } from 'vitest';
import { formatDate, todayIn } from './dates';
describe('todayIn', () => {
  it('uses the shop timezone, not UTC', () => {
    // 1:00 AM on Oct 5 in Kerala = 7:30 PM on Oct 4 in UTC
    const now = new Date('2026-10-04T19:30:00Z');

    expect(todayIn('Asia/Kolkata', now)).toBe('2026-10-05');
    expect(todayIn('UTC', now)).toBe('2026-10-04');
  });
});

describe('formatDate', () => {
  it('formats a database date for display', () => {
    expect(formatDate('2026-10-04')).toBe('04 Oct 2026');
  });

  it('uses the same short month in every locale setting', () => {
    expect(formatDate('2026-09-01')).toBe('01 Sep 2026');
  });

  it('does not shift the day across timezones', () => {
    expect(formatDate('2026-01-01')).toBe('01 Jan 2026');
  });
});