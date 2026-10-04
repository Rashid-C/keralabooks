import { describe, expect, it } from 'vitest';
import { entrySchema, toCreateEntryArgs } from './entry';

const base = {
  partyId: 'c0000000-0000-4000-8000-000000000001',
  type: 'sale' as const,
  entryDate: '2026-10-05',
  billNo: '',
  note: '',
  amount: '',
  lines: [],
};

const rusk = { productId: null, name: 'Rusk', unit: 'packet' as const, qty: '2', rate: '45.50' };

describe('entrySchema', () => {
  it('accepts a bill with items', () => {
    expect(entrySchema.safeParse({ ...base, lines: [rusk] }).success).toBe(true);
  });

  it('accepts a quick bill with only an amount', () => {
    expect(entrySchema.safeParse({ ...base, amount: '500' }).success).toBe(true);
  });

  it('rejects a bill with no items and no amount', () => {
    const result = entrySchema.safeParse(base);
    expect(result.success).toBe(false);
    expect(result.error?.issues[0]?.path).toEqual(['amount']);
  });

  it('rejects a quantity of 0', () => {
    expect(entrySchema.safeParse({ ...base, lines: [{ ...rusk, qty: '0' }] }).success).toBe(false);
  });
});

describe('toCreateEntryArgs', () => {
  it('converts rupees to paise and quantities to numbers', () => {
    const data = entrySchema.parse({ ...base, lines: [{ ...rusk, qty: '0.5' }] });
    const args = toCreateEntryArgs('shop-1', data);
    expect(args.p_items).toEqual([
      { product_id: null, name: 'Rusk', unit: 'packet', qty: 0.5, rate_paise: 4550 },
    ]);
    expect(args.p_amount_paise).toBe(0);
  });

  it('uses the entered amount when there are no items', () => {
    const data = entrySchema.parse({ ...base, amount: '500' });
    expect(toCreateEntryArgs('shop-1', data).p_amount_paise).toBe(50000);
  });
});