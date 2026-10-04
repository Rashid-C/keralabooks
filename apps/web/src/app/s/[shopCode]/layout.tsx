import { notFound } from 'next/navigation';
import { ShopSwitcher } from '@/components/shop-switcher';
import { Sidebar } from '@/components/sidebar';
import { Button } from '@/components/ui/button';
import { requireRole } from '@/lib/auth';
import { signOut } from '@/lib/auth-actions';
import { createClient } from '@/lib/supabase/server';

export default async function ShopLayout({ children, params }: LayoutProps<'/s/[shopCode]'>) {
  const user = await requireRole('super_admin', 'admin');

  const { shopCode } = await params;
  const supabase = await createClient();
  const [shopsResult, profileResult] = await Promise.all([
    supabase.from('shops').select('id, name, shop_code').order('name'),
    supabase.from('profiles').select('display_name').eq('id', user.id).maybeSingle(),
  ]);
  if (shopsResult.error) throw shopsResult.error;

  const shops = shopsResult.data;
  const shop = shops.find((s) => s.shop_code === shopCode);
  if (!shop) notFound();

  return (
    <div className="flex min-h-dvh">
      <aside className="w-60 shrink-0 border-r border-border bg-surface">
        <Sidebar shopCode={shop.shop_code} />
      </aside>
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-border bg-surface px-6 py-3">
          <ShopSwitcher shops={shops.map((s) => ({ code: s.shop_code, name: s.name }))} currentCode={shop.shop_code} />
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted">{profileResult.data?.display_name}</span>
            <form action={signOut}>
              <Button type="submit" variant="secondary" size="sm">
                Sign out
              </Button>
            </form>
          </div>
        </header>
        <main className="flex-1 px-6 py-8">{children}</main>
      </div>
    </div>
  );
}