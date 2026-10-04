import { notFound } from 'next/navigation';
import { z } from 'zod';
import { requireRole } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';
import { AddStaffForm } from './add-staff-form';

export default async function ShopPage({ params }: PageProps<'/dashboard/shops/[shopId]'>) {
  await requireRole('admin');

  const { shopId } = await params;
  if (!z.uuid().safeParse(shopId).success) notFound();

  const supabase = await createClient();
  const [shopResult, staffResult] = await Promise.all([
    supabase.from('shops').select('id, name, shop_code').eq('id', shopId).maybeSingle(),
    supabase
      .from('user_roles')
      .select('user_id, profiles (display_name, username, is_active)')
      .eq('shop_id', shopId)
      .eq('role', 'employee'),
  ]);
  if (shopResult.error) throw shopResult.error;
  if (staffResult.error) throw staffResult.error;
  const shop = shopResult.data;
  if (!shop) notFound();
  const staff = staffResult.data;

  return (
    <div>
      <p className="text-sm text-muted">Shop</p>
      <h1 className="font-display text-3xl font-semibold">{shop.name}</h1>
      <p className="mt-1 font-mono text-sm text-muted">{shop.shop_code}</p>

      <section className="mt-10">
        <h2 className="text-lg font-semibold">Staff</h2>
        {staff.length === 0 ? (
          <p className="mt-3 text-sm text-muted">No staff yet.</p>
        ) : (
          <ul className="mt-4 space-y-3">
            {staff.map((s) => (
              <li key={s.user_id} className="flex items-center justify-between rounded-2xl border border-border bg-surface p-5">
                <div>
                  <p className="font-medium">{s.profiles?.display_name}</p>
                  <p className="mt-0.5 font-mono text-sm text-muted">{s.profiles?.username}</p>
                </div>
                <span className="text-xs uppercase tracking-wide text-muted">
                  {s.profiles?.is_active ? 'Active' : 'Disabled'}
                </span>
              </li>
            ))}
          </ul>
        )}
        <div className="mt-4 rounded-2xl border border-border bg-surface p-6">
          <AddStaffForm shopId={shop.id} shopCode={shop.shop_code} />
        </div>
      </section>
    </div>
  );
}