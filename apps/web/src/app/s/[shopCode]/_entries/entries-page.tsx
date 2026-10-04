import { todayIn } from '@keralabooks/domain/dates';
import { formatINR, type Paise } from '@keralabooks/domain/money';
import { requireRole } from '@/lib/auth';
import { getShop } from '@/lib/shop';
import { createClient } from '@/lib/supabase/server';
import { BillForm } from './bill-form';

export async function EntriesPage({ shopCode, type }: { shopCode: string; type: 'sale' | 'purchase' }) {
  await requireRole('super_admin', 'admin');
  const shop = await getShop(shopCode);
  const supabase = await createClient();

  const [partiesResult, productsResult, entriesResult] = await Promise.all([
    supabase.from('parties').select('id, name').eq('shop_id', shop.id).is('deleted_at', null).order('name'),
    supabase.from('products').select('id, name, unit, rate_paise').eq('shop_id', shop.id).is('deleted_at', null).order('name'),
    supabase
      .from('entries')
      .select('id, entry_date, bill_no, amount_paise, party:parties (name), creator:profiles!entries_created_by_fkey (display_name)')
      .eq('shop_id', shop.id)
      .eq('type', type)
      .is('deleted_at', null)
      .order('entry_date', { ascending: false })
      .order('created_at', { ascending: false })
      .limit(50),
  ]);
  if (partiesResult.error) throw partiesResult.error;
  if (productsResult.error) throw productsResult.error;
  if (entriesResult.error) throw entriesResult.error;

  const title = type === 'sale' ? 'Sales' : 'Purchases';

  return (
    <div className="space-y-6">
      <h1 className="font-display text-3xl font-semibold">{title}</h1>

      <div className="rounded-2xl border border-border bg-surface p-6">
        <BillForm
          shopId={shop.id}
          type={type}
          parties={partiesResult.data}
          products={productsResult.data}
          defaultDate={todayIn(shop.timezone)}
        />
      </div>

      <h2 className="text-lg font-semibold">Recent {title.toLowerCase()}</h2>
      {entriesResult.data.length === 0 ? (
        <p className="text-sm text-muted">No {title.toLowerCase()} recorded yet.</p>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-border bg-surface">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted">
                <th className="px-5 py-3 font-medium">Date</th>
                <th className="px-5 py-3 font-medium">Party</th>
                <th className="px-5 py-3 font-medium">Bill no.</th>
                <th className="px-5 py-3 font-medium">Added by</th>
                <th className="px-5 py-3 text-right font-medium">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {entriesResult.data.map((e) => (
                <tr key={e.id} className="transition hover:bg-background">
                  <td className="px-5 py-3.5 tabular-nums text-muted">{e.entry_date}</td>
                  <td className="px-5 py-3.5 font-medium">{e.party?.name}</td>
                  <td className="px-5 py-3.5 text-muted">{e.bill_no ?? '—'}</td>
                  <td className="px-5 py-3.5 text-muted">{e.creator?.display_name}</td>
                  <td className="px-5 py-3.5 text-right font-medium tabular-nums">{formatINR(e.amount_paise as Paise)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}