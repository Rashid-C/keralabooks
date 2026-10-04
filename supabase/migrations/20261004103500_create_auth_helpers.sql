create schema if not exists private;
grant usage on schema private to authenticated;

create function private.is_super_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.user_roles ur
    join public.profiles p on p.id = ur.user_id
    where ur.user_id = (select auth.uid())
      and ur.role = 'super_admin'
      and p.is_active
  );
$$;

revoke execute on function private.is_super_admin() from public;
grant execute on function private.is_super_admin() to authenticated;

create function private.can_access_shop(target_shop_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.user_roles ur
    join public.profiles p on p.id = ur.user_id
    left join public.shops s on s.id = target_shop_id
    where ur.user_id = (select auth.uid())
      and p.is_active
      and (
        ur.role = 'super_admin'
        or (ur.role = 'admin'    and ur.business_id = s.business_id)
        or (ur.role = 'employee' and ur.shop_id = target_shop_id)
      )
  );
$$;

revoke execute on function private.can_access_shop(uuid) from public;
grant execute on function private.can_access_shop(uuid) to authenticated;

create function private.can_manage_shop(target_shop_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.user_roles ur
    join public.profiles p on p.id = ur.user_id
    left join public.shops s on s.id = target_shop_id
    where ur.user_id = (select auth.uid())
      and p.is_active
      and (
        ur.role = 'super_admin'
        or (ur.role = 'admin' and ur.business_id = s.business_id)
      )
  );
$$;

revoke execute on function private.can_manage_shop(uuid) from public;
grant execute on function private.can_manage_shop(uuid) to authenticated;