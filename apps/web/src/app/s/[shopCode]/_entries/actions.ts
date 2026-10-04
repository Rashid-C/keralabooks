'use server';

import { entrySchema, toCreateEntryArgs } from '@keralabooks/domain/entry';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { requireRole } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';

export type EntryFormState = { error: string | null; savedAt: number | null };

export async function createEntry(
  shopId: string,
  _prev: EntryFormState,
  formData: FormData,
): Promise<EntryFormState> {
  await requireRole('super_admin', 'admin');
  if (!z.uuid().safeParse(shopId).success) return { error: 'Invalid shop', savedAt: null };

  let lines: unknown;
  try {
    lines = JSON.parse(String(formData.get('lines') ?? '[]'));
  } catch {
    return { error: 'Invalid items', savedAt: null };
  }

  const parsed = entrySchema.safeParse({
    partyId: formData.get('partyId'),
    type: formData.get('type'),
    entryDate: formData.get('entryDate'),
    billNo: String(formData.get('billNo') ?? ''),
    note: String(formData.get('note') ?? ''),
    amount: String(formData.get('amount') ?? ''),
    lines,
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? 'Check the bill', savedAt: null };
  }

  const supabase = await createClient();
  const { error } = await supabase.rpc('create_entry', toCreateEntryArgs(shopId, parsed.data));

  if (error) {
    if (error.code === '22023') return { error: error.message, savedAt: null };
    if (error.code === '23503') return { error: 'That party or item is not in this shop.', savedAt: null };
    if (error.code === '42501') return { error: 'You can’t record bills in this shop.', savedAt: null };
    return { error: 'Could not save the bill. Try again.', savedAt: null };
  }

  revalidatePath('/s/[shopCode]', 'layout');
  return { error: null, savedAt: Date.now() };
}