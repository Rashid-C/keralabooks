import { formatINR, type Paise } from '@keralabooks/domain/money';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { z } from 'zod';
import { requireRole } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';
import { unitLabels } from '@/lib/units';
import { AddProductForm } from './add-product-form';

export default async function ProductsPage({ params }: PageProps<'/dashboard/shops/[shopId]/products'>) {
  await requireRole('admin');

  const { shopId } = await params;
  if (!z.uuid().safeParse(shopId).success) notFound();

  const supabase = await createClient();
  const [shopResult, productsResult] = await Promise.all([
    supabase.from('shops').select('id, name').eq('id', shopId).maybeSingle(),
    supabase
      .from('products')
      .select('id, name, unit, rate_paise')
      .eq('shop_id', shopId)
      .is('deleted_at', null)
      .order('name'),
  ]);
  if (shopResult.error) throw shopResult.error;
  if (productsResult.error) throw productsResult.error;
  const shop = shopResult.data;
  if (!shop) notFound();
  const products = productsResult.data;

  return (
    <div>
      <Link href={`/dashboard/shops/${shop.id}`} className="text-sm text-muted hover:text-foreground">
        ← {shop.name}
      </Link>
      <h1 className="mt-1 font-display text-3xl font-semibold">Items</h1>

      {products.length === 0 ? (
        <p className="mt-6 text-sm text-muted">No items yet. Add the first one below.</p>
      ) : (
        <ul className="mt-6 divide-y divide-border rounded-2xl border border-border bg-surface">
          {products.map((p) => (
            <li key={p.id} className="flex items-center justify-between px-5 py-4">
              <div>
                <p className="font-medium">{p.name}</p>
                <p className="text-sm text-muted">{unitLabels[p.unit]}</p>
              </div>
              <p className="font-medium tabular-nums">{formatINR(p.rate_paise as Paise)}</p>
            </li>
          ))}
        </ul>
      )}

      <div className="mt-6 rounded-2xl border border-border bg-surface p-6">
        <AddProductForm shopId={shop.id} />
      </div>
    </div>
  );
}