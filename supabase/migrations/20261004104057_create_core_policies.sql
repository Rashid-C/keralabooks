create policy "shops: members can read their shops"
on public.shops
for select
to authenticated
using ( private.can_access_shop(id) );

create function private.can_access_business(target_business_id uuid)
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
      and p.is_active
      and (ur.role = 'super_admin' or ur.business_id = target_business_id)
  );
$$;

revoke execute on function private.can_access_business(uuid) from public;
grant execute on function private.can_access_business(uuid) to authenticated;

create policy "businesses: members can read their business"
on public.businesses
for select
to authenticated
using ( private.can_access_business(id) );

create function private.can_view_profile(target_user_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select (select auth.uid()) = target_user_id
  or exists (
    select 1
    from public.user_roles me
    join public.profiles mp on mp.id = me.user_id
    left join public.user_roles them on them.user_id = target_user_id
    where me.user_id = (select auth.uid())
      and mp.is_active
      and (
        me.role = 'super_admin'
        or (me.role = 'admin' and them.business_id = me.business_id)
        or (me.role = 'employee'
            and them.business_id = me.business_id
            and (them.shop_id = me.shop_id or them.role = 'admin'))
      )
  );
$$;

revoke execute on function private.can_view_profile(uuid) from public;
grant execute on function private.can_view_profile(uuid) to authenticated;

create policy "profiles: read allowed profiles"
on public.profiles
for select
to authenticated
using ( private.can_view_profile(id) );

create policy "user_roles: read allowed roles"
on public.user_roles
for select
to authenticated
using ( private.can_view_profile(user_id) );