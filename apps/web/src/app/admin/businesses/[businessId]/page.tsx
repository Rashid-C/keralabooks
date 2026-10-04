import { notFound } from 'next/navigation';
import { z } from 'zod';
import { requireRole } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';
import { AddOwnerForm } from './add-owner-form';
import { AddShopForm } from './add-shop-form';

export default async function BusinessPage({ params }: PageProps<'/admin/businesses/[businessId]'>) {
  await requireRole('super_admin');

  const { businessId } = await params;
  if (!z.uuid().safeParse(businessId).success) notFound();

  const supabase = await createClient();

  const [businessResult, ownersResult] = await Promise.all([
    supabase
      .from('businesses')
      .select('id, name, status, shops (id, name, shop_code, status)')
      .eq('id', businessId)
      .maybeSingle(),
    supabase
      .from('user_roles')
      .select('user_id, profiles (display_name, username, is_active)')
      .eq('business_id', businessId)
      .eq('role', 'admin'),
  ]);

  if (businessResult.error) throw businessResult.error;
  if (ownersResult.error) throw ownersResult.error;
  const business = businessResult.data;
  if (!business) notFound();
  const owners = ownersResult.data;

  return (
    <div>
      <p className="text-sm text-muted">Business</p>
      <h1 className="font-display text-3xl font-semibold">{business.name}</h1>

      <section className="mt-10">
        <h2 className="text-lg font-semibold">Owners</h2>
        {owners.length === 0 ? (
          <p className="mt-3 text-sm text-muted">No owner account yet.</p>
        ) : (
          <ul className="mt-4 space-y-3">
            {owners.map((o) => (
              <li key={o.user_id} className="flex items-center justify-between rounded-2xl border border-border bg-surface p-5">
                <div>
                  <p className="font-medium">{o.profiles?.display_name}</p>
                  <p className="mt-0.5 font-mono text-sm text-muted">{o.profiles?.username}</p>
                </div>
                <span className="text-xs uppercase tracking-wide text-muted">
                  {o.profiles?.is_active ? 'Active' : 'Disabled'}
                </span>
              </li>
            ))}
          </ul>
        )}
        <div className="mt-4 rounded-2xl border border-border bg-surface p-6">
          <AddOwnerForm businessId={business.id} />
        </div>
      </section>

      <section className="mt-12">
        <h2 className="text-lg font-semibold">Shops</h2>
        {business.shops.length === 0 ? (
          <p className="mt-3 text-sm text-muted">No shops yet.</p>
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
        <div className="mt-4 rounded-2xl border border-border bg-surface p-6">
          <AddShopForm businessId={business.id} />
        </div>
      </section>
    </div>
  );
}