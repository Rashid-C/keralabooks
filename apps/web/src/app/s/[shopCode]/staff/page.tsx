import type { Metadata } from 'next';
import { requireRole } from '@/lib/auth';
import { getShop } from '@/lib/shop';
import { createClient } from '@/lib/supabase/server';
import { AddStaffForm } from './add-staff-form';

export const metadata: Metadata = { title: 'Staff' };

export default async function StaffPage({ params }: PageProps<'/s/[shopCode]/staff'>) {
  await requireRole('super_admin', 'admin');
  const { shopCode } = await params;
  const shop = await getShop(shopCode);

  const supabase = await createClient();
  const { data: staff, error } = await supabase
    .from('user_roles')
    .select('user_id, profiles (display_name, username, is_active)')
    .eq('shop_id', shop.id)
    .eq('role', 'employee');
  if (error) throw error;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-semibold">Staff</h1>
        <p className="mt-1 text-sm text-muted">
          Staff sign in with shop code <span className="font-mono">{shop.shop_code}</span> and their username.
        </p>
      </div>

      <div className="rounded-2xl border border-border bg-surface p-6">
        <AddStaffForm shopId={shop.id} shopCode={shop.shop_code} />
      </div>

      {staff.length > 0 && (
        <div className="overflow-x-auto rounded-2xl border border-border bg-surface">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted">
                <th className="px-5 py-3 font-medium">Name</th>
                <th className="px-5 py-3 font-medium">Username</th>
                <th className="px-5 py-3 text-right font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {staff.map((s) => (
                <tr key={s.user_id} className="transition hover:bg-background">
                  <td className="px-5 py-3.5 font-medium">{s.profiles?.display_name}</td>
                  <td className="px-5 py-3.5 font-mono text-muted">{s.profiles?.username}</td>
                  <td className="px-5 py-3.5 text-right">
                    <span
                      className={
                        s.profiles?.is_active
                          ? 'rounded-full bg-sale/10 px-2.5 py-1 text-xs font-medium text-sale'
                          : 'rounded-full bg-muted/10 px-2.5 py-1 text-xs font-medium text-muted'
                      }
                    >
                      {s.profiles?.is_active ? 'Active' : 'Disabled'}
                    </span>
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