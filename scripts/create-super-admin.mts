import { createClient } from '@supabase/supabase-js';
import { input, password } from '@inquirer/prompts';

const url = process.env.SUPABASE_URL;
const secretKey = process.env.SUPABASE_SECRET_KEY;
if (!url || !secretKey) {
  throw new Error('Missing SUPABASE_URL or SUPABASE_SECRET_KEY');
}

const supabase = createClient(url, secretKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

console.log(`Creating super admin on: ${url}`);

const email = await input({
  message: 'Email:',
  validate: (v) => /^\S+@\S+\.\S+$/.test(v) || 'Enter a valid email',
});
const pass = await password({
  message: 'Password (min 12 characters):',
  mask: '*',
  validate: (v) => v.length >= 12 || 'At least 12 characters',
});
const confirm = await password({ message: 'Confirm password:', mask: '*' });
if (pass !== confirm) throw new Error('Passwords do not match');

const { data, error } = await supabase.auth.admin.createUser({
  email,
  password: pass,
  email_confirm: true,
});
if (error) throw error;
const userId = data.user.id;

const { error: profileError } = await supabase
  .from('profiles')
  .insert({ id: userId, username: 'superadmin', display_name: 'Super Admin' });
if (profileError) {
  await supabase.auth.admin.deleteUser(userId);
  throw profileError;
}

const { error: roleError } = await supabase
  .from('user_roles')
  .insert({ user_id: userId, role: 'super_admin' });
if (roleError) {
  await supabase.from('profiles').delete().eq('id', userId);
  await supabase.auth.admin.deleteUser(userId);
  throw roleError;
}

console.log(`Super admin created: ${email}`);