'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { requireRole } from '@/lib/auth';
import { createAdminClient } from '@/lib/supabase/admin';

const businessSchema = z.object({
  name: z.string().trim().min(2, 'At least 2 characters').max(80, 'At most 80 characters'),
});

export type FormState = { error: string | null };

export async function createBusiness(_prev: FormState, formData: FormData): Promise<FormState> {
  await requireRole('super_admin');

  const parsed = businessSchema.safeParse({ name: formData.get('name') });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? 'Check the name' };
  }

  const admin = createAdminClient();
  const { error } = await admin.from('businesses').insert({ name: parsed.data.name });
  if (error) {
    return { error: 'Could not create the business. Try again.' };
  }

  revalidatePath('/admin');
  redirect('/admin');
}