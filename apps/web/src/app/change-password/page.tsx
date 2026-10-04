import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { ChangePasswordForm } from './change-password-form';

export const metadata: Metadata = { title: 'Set your password' };

export default async function ChangePasswordPage() {
  const user = await getCurrentUser();
  if (!user) redirect('/login');
  if (!user.mustChangePassword) redirect('/');

  return (
    <main className="grid min-h-dvh place-items-center px-6 py-12">
      <div className="w-full max-w-sm">
        <div className="mb-10 text-center">
          <p className="font-display text-4xl font-semibold tracking-tight">KeralaBooks</p>
          <p className="mt-2 text-sm text-muted">Choose your own password to continue.</p>
        </div>
        <div className="rounded-2xl border border-border bg-surface p-8 shadow-sm">
          <ChangePasswordForm />
        </div>
      </div>
    </main>
  );
}