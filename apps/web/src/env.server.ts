import 'server-only';
import { z } from 'zod';

const serverEnvSchema = z.object({
  SUPABASE_SECRET_KEY: z.string().startsWith('sb_secret_'),
  STAFF_LOGIN_DOMAIN: z.string().regex(/^[a-z0-9.-]+\.[a-z]{2,}$/, 'Must be a domain like staff.example.com'),
});

export const serverEnv = serverEnvSchema.parse({
  SUPABASE_SECRET_KEY: process.env.SUPABASE_SECRET_KEY,
  STAFF_LOGIN_DOMAIN: process.env.STAFF_LOGIN_DOMAIN,
});