import 'server-only';
import { notFound } from 'next/navigation';
import { cache } from 'react';
import { createClient } from '@/lib/supabase/server';

export const getShop = cache(async (shopCode: string) => {
  const supabase = await createClient();
  const { data: shop } = await supabase
    .from('shops')
    .select('id, name, shop_code, business_id, timezone')
    .eq('shop_code', shopCode)
    .maybeSingle();
  if (!shop) notFound();
  return shop;
});