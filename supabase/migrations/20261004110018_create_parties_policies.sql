create policy "parties: read in accessible shops"
on public.parties
for select
to authenticated
using (
  private.can_access_shop(shop_id)
  and (deleted_at is null or private.can_manage_shop(shop_id))
);

create policy "parties: add in accessible shops"
on public.parties
for insert
to authenticated
with check (
  private.can_access_shop(shop_id)
  and created_by = (select auth.uid())
  and updated_by is null
  and deleted_at is null
);

create function private.protect_audit_fields()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if new.shop_id is distinct from old.shop_id then
    raise exception 'shop_id cannot be changed';
  end if;

  new.created_by := old.created_by;
  new.created_at := old.created_at;
  new.updated_by := (select auth.uid());
  return new;
end;
$$;

create trigger protect_audit_fields before update on public.parties
  for each row execute function private.protect_audit_fields();

create policy "parties: managers can edit"
on public.parties
for update
to authenticated
using ( private.can_manage_shop(shop_id) )
with check ( private.can_manage_shop(shop_id) );