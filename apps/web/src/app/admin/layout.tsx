import type { ReactNode } from 'react';
import Link from 'next/link';
import { requireRole } from '@/lib/auth';
import { signOut } from '@/lib/auth-actions';

export default async function AdminLayout({ children }: { children: ReactNode }) {
  await requireRole('super_admin');

  return (
    <div className="min-h-dvh">
      <header className="flex items-center justify-between border-b border-border bg-surface px-6 py-4">
        <Link href="/admin" className="flex items-baseline gap-2">
          <span className="font-display text-xl font-semibold">KeralaBooks</span>
          <span className="text-sm text-muted">Admin</span>
        </Link>
        <form action={signOut}>
          <button
            type="submit"
            className="rounded-lg border border-border px-4 py-2 text-sm font-medium transition hover:bg-background"
          >
            Sign out
          </button>
        </form>
      </header>
      <main className="mx-auto max-w-5xl px-6 py-10">{children}</main>
    </div>
  );
}