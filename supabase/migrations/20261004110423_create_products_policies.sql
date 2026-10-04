create policy "products: read in accessible shops"
on public.products
for select
to authenticated
using (
  private.can_access_shop(shop_id)
  and (deleted_at is null or private.can_manage_shop(shop_id))
);

create policy "products: managers can add"
on public.products
for insert
to authenticated
with check (
  private.can_manage_shop(shop_id)
  and created_by = (select auth.uid())
  and updated_by is null
  and deleted_at is null
);

create policy "products: managers can edit"
on public.products
for update
to authenticated
using ( private.can_manage_shop(shop_id) )
with check ( private.can_manage_shop(shop_id) );