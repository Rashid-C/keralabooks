create policy "entries: read in accessible shops"
on public.entries
for select
to authenticated
using (
  private.can_access_shop(shop_id)
  and (deleted_at is null or private.can_manage_shop(shop_id))
);

create policy "entries: add in accessible shops"
on public.entries
for insert
to authenticated
with check (
  private.can_access_shop(shop_id)
  and created_by = (select auth.uid())
  and updated_by is null
  and deleted_at is null
);

create policy "entries: managers can edit"
on public.entries
for update
to authenticated
using ( private.can_manage_shop(shop_id) )
with check ( private.can_manage_shop(shop_id) );

create policy "entry_items: read in accessible shops"
on public.entry_items
for select
to authenticated
using ( private.can_access_shop(shop_id) );

create policy "entry_items: add to own new bills or as manager"
on public.entry_items
for insert
to authenticated
with check (
  private.can_access_shop(shop_id)
  and (
    private.can_manage_shop(shop_id)
    or exists (
      select 1
      from public.entries e
      where e.id = entry_id
        and e.created_by = (select auth.uid())
        and e.created_at > now() - interval '10 minutes'
    )
  )
);

create policy "entry_items: managers can edit"
on public.entry_items
for update
to authenticated
using ( private.can_manage_shop(shop_id) )
with check ( private.can_manage_shop(shop_id) );

create policy "entry_items: managers can remove"
on public.entry_items
for delete
to authenticated
using ( private.can_manage_shop(shop_id) );