import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { signOut } from '@/lib/auth-actions';

const roleLabels = {
  super_admin: 'Super admin',
  admin: 'Owner',
  employee: 'Staff',
} as const;

export default async function HomePage() {
  const user = await getCurrentUser();
  if (!user) redirect('/login');

  return (
    <main className="min-h-dvh">
      <header className="flex items-center justify-between border-b border-border bg-surface px-6 py-4">
        <p className="font-display text-xl font-semibold">KeralaBooks</p>
        <form action={signOut}>
          <button
            type="submit"
            className="rounded-lg border border-border px-4 py-2 text-sm font-medium transition hover:bg-background"
          >
            Sign out
          </button>
        </form>
      </header>

      <section className="mx-auto max-w-3xl px-6 py-12">
        <p className="text-sm text-muted">Signed in as</p>
        <h1 className="mt-1 text-2xl font-semibold">{user.email}</h1>
        <span className="mt-3 inline-block rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
          {roleLabels[user.role]}
        </span>
      </section>
    </main>
  );
}