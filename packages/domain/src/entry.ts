import { Constants } from '@keralabooks/db-types';
import { z } from 'zod';
import { toPaise } from './money';

export const entryLineSchema = z.object({
  productId: z.uuid().nullable(),
  name: z.string().trim().min(1, 'Item name is required').max(80),
  unit: z.enum(Constants.public.Enums.product_unit),
  qty: z
    .string()
    .trim()
    .regex(/^\d+(\.\d{1,3})?$/, 'Enter a quantity like 2 or 0.5')
    .refine((v) => Number(v) > 0, 'Quantity must be more than 0'),
  rate: z.string().trim().regex(/^\d+(\.\d{1,2})?$/, 'Enter a rate like 45 or 45.50'),
});

export const entrySchema = z
  .object({
    partyId: z.uuid('Choose a party'),
    type: z.enum(['sale', 'purchase']),
    entryDate: z.iso.date('Choose a date'),
    billNo: z.string().trim().max(30, 'Bill number is too long'),
    note: z.string().trim().max(500, 'Note is too long'),
    amount: z.string().trim(),
    lines: z.array(entryLineSchema).max(100, 'A bill can have at most 100 items'),
  })
  .refine((d) => d.lines.length > 0 || /^\d+(\.\d{1,2})?$/.test(d.amount) && toPaise(d.amount) > 0, {
    message: 'Add items or enter an amount',
    path: ['amount'],
  });

export type EntryInput = z.input<typeof entrySchema>;
export type EntryData = z.output<typeof entrySchema>;

export function toCreateEntryArgs(shopId: string, d: EntryData) {
  return {
    p_shop_id: shopId,
    p_party_id: d.partyId,
    p_type: d.type,
    p_entry_date: d.entryDate,
    p_bill_no: d.billNo,
    p_note: d.note,
    p_amount_paise: d.lines.length === 0 ? toPaise(d.amount) : 0,
    p_items: d.lines.map((l) => ({
      product_id: l.productId,
      name: l.name,
      unit: l.unit,
      qty: Number(l.qty),
      rate_paise: toPaise(l.rate),
    })),
  };
}