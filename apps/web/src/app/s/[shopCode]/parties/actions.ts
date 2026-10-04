'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { requireRole } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';

const partySchema = z.object({
  name: z.string().trim().min(1, 'Enter the party name').max(80, 'At most 80 characters'),
  phone: z
    .string()
    .regex(/^\+?[0-9]{7,15}$/, 'Enter a phone number with digits only')
    .nullable(),
});

export type PartyFormState = { error: string | null };

export async function createParty(
  shopId: string,
  _prev: PartyFormState,
  formData: FormData,
): Promise<PartyFormState> {
  await requireRole('super_admin', 'admin');
  if (!z.uuid().safeParse(shopId).success) return { error: 'Invalid shop' };

  const rawPhone = String(formData.get('phone') ?? '').replace(/\s/g, '');

  const parsed = partySchema.safeParse({
    name: formData.get('name'),
    phone: rawPhone === '' ? null : rawPhone,
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? 'Check the details' };
  }

  const supabase = await createClient();
  const { error } = await supabase.from('parties').insert({
    shop_id: shopId,
    name: parsed.data.name,
    phone: parsed.data.phone,
  });

  if (error) {
    if (error.code === '23505') return { error: 'A party with this name already exists in this shop.' };
    if (error.code === '42501') return { error: 'Shop not found' };
    return { error: 'Could not add the party. Try again.' };
  }

  revalidatePath('/s/[shopCode]/parties', 'page');
  return { error: null };
}