import { createBrowserClient } from '@supabase/ssr';
import type { Database } from '@keralabooks/db-types';
import { publicEnv } from '@/env';

export function createClient() {
  return createBrowserClient<Database>(
    publicEnv.NEXT_PUBLIC_SUPABASE_URL,
    publicEnv.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
  );
}