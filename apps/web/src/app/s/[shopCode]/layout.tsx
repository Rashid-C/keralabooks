import { notFound } from 'next/navigation';
import { requireRole } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';
import { Sidebar } from '@/components/sidebar';

export default async function ShopLayout({ children, params }: LayoutProps<'/s/[shopCode]'>) {
  await requireRole('super_admin', 'admin');

  const { shopCode } = await params;
  const supabase = await createClient();
  const { data: shop } = await supabase
    .from('shops')
    .select('id, name, shop_code, business_id')
    .eq('shop_code', shopCode)
    .maybeSingle();
  if (!shop) notFound();

  return (
    <div className="flex min-h-dvh">
      <aside className="w-60 shrink-0 border-r border-border bg-surface">
        <Sidebar shopCode={shop.shop_code} />
      </aside>
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="border-b border-border bg-surface px-6 py-4">
          <p className="font-medium">{shop.name}</p>
        </header>
        <main className="flex-1 px-6 py-8">{children}</main>
      </div>
    </div>
  );
}