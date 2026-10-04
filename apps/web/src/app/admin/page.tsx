import type { Metadata } from 'next';
import Link from 'next/link';
import { requireRole } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';

export const metadata: Metadata = { title: 'Businesses' };

export default async function AdminHomePage() {
  await requireRole('super_admin');

  const supabase = await createClient();
  const { data: businesses, error } = await supabase
    .from('businesses')
    .select('id, name, status, shops (id, name, shop_code)')
    .order('name');
  if (error) throw error;

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-3xl font-semibold">Businesses</h1>
        <Link
          href="/admin/businesses/new"
          className="rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition hover:opacity-90"
        >
          New business
        </Link>
      </div>

      {businesses.length === 0 ? (
        <div className="mt-10 rounded-2xl border border-dashed border-border p-12 text-center">
          <p className="font-medium">No businesses yet</p>
          <p className="mt-1 text-sm text-muted">Create the first business to add its shops and owner.</p>
        </div>
      ) : (
        <ul className="mt-8 space-y-3">
          {businesses.map((b) => (
                        <li key={b.id}>
              <Link
                href={`/admin/businesses/${b.id}`}
                className="block rounded-2xl border border-border bg-surface p-5 transition hover:border-primary/40"
              >
                <div className="flex items-center justify-between">
                  <p className="font-medium">{b.name}</p>
                  <span className="text-xs uppercase tracking-wide text-muted">{b.status}</span>
                </div>
                <p className="mt-1 text-sm text-muted">
                  {b.shops.length === 0 ? 'No shops yet' : b.shops.map((s) => s.name).join(' · ')}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}