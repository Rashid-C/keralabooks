import type { Metadata } from 'next';
import Link from 'next/link';
import { requireRole } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';

export const metadata: Metadata = { title: 'Dashboard' };

export default async function DashboardPage() {
  await requireRole('admin');

  const supabase = await createClient();
  const { data: shops, error } = await supabase
    .from('shops')
    .select('id, name, shop_code, status')
    .order('name');
  if (error) throw error;

  return (
    <div>
      <h1 className="font-display text-3xl font-semibold">Your shops</h1>

      <ul className="mt-8 grid gap-4 sm:grid-cols-2">
        {shops.map((shop) => (
          <li key={shop.id}>
            <Link
              href={`/dashboard/shops/${shop.id}`}
              className="block rounded-2xl border border-border bg-surface p-6 transition hover:border-primary/40"
            >
              <p className="text-lg font-medium">{shop.name}</p>
              <p className="mt-1 font-mono text-sm text-muted">{shop.shop_code}</p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}