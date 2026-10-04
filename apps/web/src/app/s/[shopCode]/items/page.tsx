import { formatINR, type Paise } from '@keralabooks/domain/money';
import type { Metadata } from 'next';
import { requireRole } from '@/lib/auth';
import { getShop } from '@/lib/shop';
import { createClient } from '@/lib/supabase/server';
import { unitLabels } from '@/lib/units';
import { AddProductForm } from './add-product-form';

export const metadata: Metadata = { title: 'Items' };

export default async function ItemsPage({ params }: PageProps<'/s/[shopCode]/items'>) {
  await requireRole('super_admin', 'admin');
  const { shopCode } = await params;
  const shop = await getShop(shopCode);

  const supabase = await createClient();
  const { data: products, error } = await supabase
    .from('products')
    .select('id, name, unit, rate_paise')
    .eq('shop_id', shop.id)
    .is('deleted_at', null)
    .order('name');
  if (error) throw error;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-semibold">Items</h1>
        <p className="mt-1 text-sm text-muted">{products.length} items in {shop.name}</p>
      </div>

      <div className="rounded-2xl border border-border bg-surface p-6">
        <AddProductForm shopId={shop.id} />
      </div>

      {products.length > 0 && (
        <div className="overflow-x-auto rounded-2xl border border-border bg-surface">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted">
                <th className="px-5 py-3 font-medium">Item</th>
                <th className="px-5 py-3 font-medium">Unit</th>
                <th className="px-5 py-3 text-right font-medium">Price</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {products.map((p) => (
                <tr key={p.id} className="transition hover:bg-background">
                  <td className="px-5 py-3.5 font-medium">{p.name}</td>
                  <td className="px-5 py-3.5 text-muted">{unitLabels[p.unit]}</td>
                  <td className="px-5 py-3.5 text-right font-medium tabular-nums">
                    {formatINR(p.rate_paise as Paise)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}