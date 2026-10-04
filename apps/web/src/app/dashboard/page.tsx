import { redirect } from 'next/navigation';
import { requireRole } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';

export default async function DashboardPage() {
  await requireRole('admin');

  const supabase = await createClient();
  const { data: shop } = await supabase
    .from('shops')
    .select('shop_code')
    .order('name')
    .limit(1)
    .maybeSingle();

  if (shop) redirect(`/s/${shop.shop_code}`);

  return (
    <div className="py-16 text-center">
      <h1 className="font-display text-2xl font-semibold">No shops yet</h1>
      <p className="mt-2 text-sm text-muted">Your shops will appear here once they're set up.</p>
    </div>
  );
}