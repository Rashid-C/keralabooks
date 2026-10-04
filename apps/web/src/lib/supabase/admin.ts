import 'server-only';
import { createClient } from '@supabase/supabase-js';
import type { Database } from '@keralabooks/db-types';
import { publicEnv } from '@/env';
import { serverEnv } from '@/env.server';

export function createAdminClient() {
  return createClient<Database>(
    publicEnv.NEXT_PUBLIC_SUPABASE_URL,
    serverEnv.SUPABASE_SECRET_KEY,
    { auth: { persistSession: false, autoRefreshToken: false } },
  );
}