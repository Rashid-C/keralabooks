import { MagnifyingGlassIcon } from '@phosphor-icons/react/ssr';
import type { Metadata } from 'next';
import { requireRole } from '@/lib/auth';
import { getShop } from '@/lib/shop';
import { createClient } from '@/lib/supabase/server';
import { AddPartyForm } from './add-party-form';

export const metadata: Metadata = { title: 'Parties' };

export default async function PartiesPage({ params, searchParams }: PageProps<'/s/[shopCode]/parties'>) {
  await requireRole('super_admin', 'admin');
  const { shopCode } = await params;
  const shop = await getShop(shopCode);

  const sp = await searchParams;
  const q = typeof sp.q === 'string' ? sp.q.trim().slice(0, 80) : '';

  const supabase = await createClient();
  let query = supabase
    .from('parties')
    .select('id, name, phone, creator:profiles!parties_created_by_fkey (display_name)')
    .eq('shop_id', shop.id)
    .is('deleted_at', null)
    .order('name')
    .limit(100);
  if (q) query = query.ilike('name', `%${q.replace(/[%_\\]/g, '\\$&')}%`);

  const { data: parties, error } = await query;
  if (error) throw error;

  return (
    <div className="space-y-6">
      <h1 className="font-display text-3xl font-semibold">Parties</h1>

      <div className="rounded-2xl border border-border bg-surface p-6">
        <AddPartyForm shopId={shop.id} />
      </div>

      <form className="relative max-w-sm">
        <MagnifyingGlassIcon size={18} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
        <input
          name="q"
          defaultValue={q}
          placeholder="Search parties"
          aria-label="Search parties"
          className="h-11 w-full rounded-xl border border-border bg-surface pl-10 pr-4 text-base outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/15"
        />
      </form>

      {parties.length === 0 ? (
        <p className="text-sm text-muted">{q ? `No parties match “${q}”.` : 'No parties yet.'}</p>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-border bg-surface">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted">
                <th className="px-5 py-3 font-medium">Name</th>
                <th className="px-5 py-3 font-medium">Phone</th>
                <th className="px-5 py-3 font-medium">Added by</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {parties.map((p) => (
                <tr key={p.id} className="transition hover:bg-background">
                  <td className="px-5 py-3.5 font-medium">{p.name}</td>
                  <td className="px-5 py-3.5 tabular-nums text-muted">{p.phone ?? '—'}</td>
                  <td className="px-5 py-3.5 text-muted">{p.creator?.display_name}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}