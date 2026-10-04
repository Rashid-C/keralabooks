import { redirect } from 'next/navigation';
import { AppHeader } from '@/components/app-header';
import { getCurrentUser } from '@/lib/auth';

export default async function HomePage() {
  const user = await getCurrentUser();
  if (!user) redirect('/login');
  if (user.mustChangePassword) redirect('/change-password');
  if (user.role === 'super_admin') redirect('/admin');
  if (user.role === 'admin') redirect('/dashboard');

  return (
    <div className="min-h-dvh">
      <AppHeader homeHref="/" />
      <main className="grid place-items-center px-6 py-24">
        <div className="max-w-sm text-center">
          <h1 className="font-display text-3xl font-semibold">Use the mobile app</h1>
          <p className="mt-3 text-muted">
            Staff record sales and purchases in the KeralaBooks app on the shop tablet or your phone.
          </p>
        </div>
      </main>
    </div>
  );
}