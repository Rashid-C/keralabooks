import 'server-only';
import { cache } from 'react';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';

const claimsSchema = z.object({
  sub: z.uuid(),
  email: z.email().optional(),
  app_role: z.enum(['super_admin', 'admin', 'employee']),
  business_id: z.uuid().nullish(),
  shop_id: z.uuid().nullish(),
});

export type CurrentUser = {
  id: string;
  email: string | undefined;
  role: 'super_admin' | 'admin' | 'employee';
  businessId: string | null;
  shopId: string | null;
};

export const getCurrentUser = cache(async (): Promise<CurrentUser | null> => {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();

  const parsed = claimsSchema.safeParse(data?.claims);
  if (!parsed.success) return null;

  const c = parsed.data;
  return {
    id: c.sub,
    email: c.email,
    role: c.app_role,
    businessId: c.business_id ?? null,
    shopId: c.shop_id ?? null,
  };
});