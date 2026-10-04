'use server';

import { redirect } from 'next/navigation';
import { z } from 'zod';
import { getCurrentUser } from '@/lib/auth';
import { createAdminClient } from '@/lib/supabase/admin';
import { createClient } from '@/lib/supabase/server';

const passwordSchema = z
  .object({
    password: z.string().min(12, 'At least 12 characters').max(72, 'At most 72 characters'),
    confirm: z.string(),
  })
  .refine((d) => d.password === d.confirm, {
    message: 'Passwords don’t match',
    path: ['confirm'],
  });

export type ChangePasswordState = { error: string | null };

export async function changePassword(
  _prev: ChangePasswordState,
  formData: FormData,
): Promise<ChangePasswordState> {
  const user = await getCurrentUser();
  if (!user) redirect('/login');

  const parsed = passwordSchema.safeParse({
    password: formData.get('password'),
    confirm: formData.get('confirm'),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? 'Check your password' };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({ password: parsed.data.password });
  if (error) {
    return {
      error:
        error.code === 'same_password'
          ? 'Choose a different password from your temporary one.'
          : 'Could not change your password. Try again.',
    };
  }

  const admin = createAdminClient();
  const { error: flagError } = await admin
    .from('profiles')
    .update({ must_change_password: false })
    .eq('id', user.id);
  if (flagError) {
    return { error: 'Your password changed, but something went wrong. Try again.' };
  }

  redirect('/');
}