import type { Metadata } from 'next';
import { LoginForm } from './login-form';

export const metadata: Metadata = {
  title: 'Sign in',
};

export default function LoginPage() {
  return (
    <main className="grid min-h-dvh place-items-center px-6 py-12">
      <div className="w-full max-w-sm">
        <div className="mb-10 text-center">
          <p className="font-display text-4xl font-semibold tracking-tight">KeralaBooks</p>
          <p className="mt-2 text-sm text-muted">Sign in to manage your shops</p>
        </div>

        <div className="rounded-2xl border border-border bg-surface p-8 shadow-sm">
          <LoginForm />
        </div>
      </div>
    </main>
  );
}