create type public.entry_type as enum ('sale', 'purchase');

alter table public.parties
  add constraint parties_id_shop_id_key unique (id, shop_id);

create table public.entries (
  id            uuid primary key default gen_random_uuid(),
  shop_id       uuid not null references public.shops (id) on delete restrict,
  party_id      uuid not null,
  type          public.entry_type not null,
  entry_date    date not null,
  bill_no       text check (length(trim(bill_no)) between 1 and 30),
  amount_paise  bigint not null default 0 check (amount_paise >= 0),
  note          text check (length(note) <= 500),
  created_by    uuid not null default auth.uid() references public.profiles (id),
  updated_by    uuid references public.profiles (id),
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  deleted_at    timestamptz,

  foreign key (party_id, shop_id)
    references public.parties (id, shop_id) on delete restrict
);

create index entries_shop_date_idx
  on public.entries (shop_id, entry_date desc)
  where deleted_at is null;

create index entries_shop_party_date_idx
  on public.entries (shop_id, party_id, entry_date desc)
  where deleted_at is null;

create trigger set_updated_at before update on public.entries
  for each row execute function private.set_updated_at();

create trigger protect_audit_fields before update on public.entries
  for each row execute function private.protect_audit_fields();

alter table public.entries enable row level security;