import { notFound } from 'next/navigation';
import { z } from 'zod';
import { requireRole } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';

export default async function BusinessPage({ params }: PageProps<'/admin/businesses/[businessId]'>) {
  await requireRole('super_admin');

  const { businessId } = await params;
  if (!z.uuid().safeParse(businessId).success) notFound();

  const supabase = await createClient();
  const { data: business, error } = await supabase
    .from('businesses')
    .select('id, name, status, shops (id, name, shop_code, status)')
    .eq('id', businessId)
    .maybeSingle();
  if (error) throw error;
  if (!business) notFound();

  return (
    <div>
      <p className="text-sm text-muted">Business</p>
      <h1 className="font-display text-3xl font-semibold">{business.name}</h1>

      <h2 className="mt-10 text-lg font-semibold">Shops</h2>
      {business.shops.length === 0 ? (
        <div className="mt-4 rounded-2xl border border-dashed border-border p-10 text-center">
          <p className="font-medium">No shops yet</p>
          <p className="mt-1 text-sm text-muted">Add the first shop below.</p>
        </div>
      ) : (
        <ul className="mt-4 space-y-3">
          {business.shops.map((shop) => (
            <li key={shop.id} className="flex items-center justify-between rounded-2xl border border-border bg-surface p-5">
              <div>
                <p className="font-medium">{shop.name}</p>
                <p className="mt-0.5 font-mono text-sm text-muted">{shop.shop_code}</p>
              </div>
              <span className="text-xs uppercase tracking-wide text-muted">{shop.status}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}