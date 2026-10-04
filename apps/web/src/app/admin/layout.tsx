import type { ReactNode } from 'react';
import { AppHeader } from '@/components/app-header';
import { requireRole } from '@/lib/auth';

export default async function AdminLayout({ children }: { children: ReactNode }) {
  await requireRole('super_admin');

  return (
    <div className="min-h-dvh">
      <AppHeader homeHref="/admin" subtitle="Admin" />
      <main className="mx-auto max-w-5xl px-6 py-10">{children}</main>
    </div>
  );
}