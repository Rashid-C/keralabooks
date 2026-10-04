create function public.custom_access_token_hook(event jsonb)
returns jsonb
language plpgsql
stable
set search_path = ''
as $$
declare
  claims jsonb := event -> 'claims';
  r record;
begin
  select ur.role, ur.business_id, ur.shop_id
  into r
  from public.user_roles ur
  where ur.user_id = (event ->> 'user_id')::uuid;

  if found then
    claims := claims || jsonb_build_object(
      'app_role',    r.role,
      'business_id', r.business_id,
      'shop_id',     r.shop_id
    );
  end if;

  return jsonb_set(event, '{claims}', claims);
end;
$$;

grant usage on schema public to supabase_auth_admin;
grant execute on function public.custom_access_token_hook(jsonb) to supabase_auth_admin;
revoke execute on function public.custom_access_token_hook(jsonb) from authenticated, anon, public;

grant select on public.user_roles to supabase_auth_admin;

create policy "user_roles: auth server can read for tokens"
on public.user_roles
for select
to supabase_auth_admin
using (true);