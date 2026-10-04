import { describe, expect, it } from 'vitest';
import { todayIn } from './dates';

describe('todayIn', () => {
  it('uses the shop timezone, not UTC', () => {
    // 1:00 AM on Oct 5 in Kerala = 7:30 PM on Oct 4 in UTC
    const now = new Date('2026-10-04T19:30:00Z');

    expect(todayIn('Asia/Kolkata', now)).toBe('2026-10-05');
    expect(todayIn('UTC', now)).toBe('2026-10-04');
  });
});