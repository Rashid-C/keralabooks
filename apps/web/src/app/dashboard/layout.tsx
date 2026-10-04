import type { ReactNode } from 'react';
import { AppHeader } from '@/components/app-header';
import { requireRole } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const user = await requireRole('admin');

  const supabase = await createClient();
  const { data: business } = await supabase
    .from('businesses')
    .select('name')
    .eq('id', user.businessId ?? '')
    .maybeSingle();

  return (
    <div className="min-h-dvh">
      <AppHeader homeHref="/dashboard" subtitle={business?.name ?? 'Dashboard'} />
      <main className="mx-auto max-w-5xl px-6 py-10">{children}</main>
    </div>
  );
}