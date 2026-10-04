create table public.activity_log (
  id          bigint generated always as identity primary key,
  shop_id     uuid not null references public.shops (id) on delete restrict,
  actor_id    uuid references public.profiles (id),
  action      text not null check (action in ('insert', 'update', 'delete')),
  table_name  text not null,
  record_id   uuid not null,
  old_data    jsonb,
  new_data    jsonb,
  created_at  timestamptz not null default now()
);

create index activity_log_shop_time_idx
  on public.activity_log (shop_id, created_at desc);

create index activity_log_shop_actor_time_idx
  on public.activity_log (shop_id, actor_id, created_at desc);

alter table public.activity_log enable row level security;

create policy "activity_log: managers can read"
on public.activity_log
for select
to authenticated
using ( private.can_manage_shop(shop_id) );

create function private.log_activity()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  r record;
begin
  if tg_op = 'DELETE' then
    r := old;
  else
    r := new;
  end if;

  insert into public.activity_log
    (shop_id, actor_id, action, table_name, record_id, old_data, new_data)
  values (
    r.shop_id,
    (select auth.uid()),
    lower(tg_op),
    tg_table_name,
    r.id,
    case when tg_op <> 'INSERT' then to_jsonb(old) end,
    case when tg_op <> 'DELETE' then to_jsonb(new) end
  );

  return null;
end;
$$;

create trigger log_activity after insert or update or delete on public.parties
  for each row execute function private.log_activity();

create trigger log_activity after insert or update or delete on public.products
  for each row execute function private.log_activity();

create trigger log_activity after insert or update or delete on public.entries
  for each row execute function private.log_activity();

create trigger log_activity after insert or update or delete on public.entry_items
  for each row execute function private.log_activity();