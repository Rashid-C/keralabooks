create type public.party_kind as enum ('customer', 'supplier', 'both');

create table public.parties (
  id          uuid primary key default gen_random_uuid(),
  shop_id     uuid not null references public.shops (id) on delete restrict,
  name        text not null check (length(trim(name)) between 1 and 80),
  phone       text check (phone ~ '^\+?[0-9]{7,15}$'),
  kind        public.party_kind not null default 'customer',
  created_by  uuid not null default auth.uid() references public.profiles (id),
  updated_by  uuid references public.profiles (id),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  deleted_at  timestamptz
);

create unique index parties_shop_name_key
  on public.parties (shop_id, lower(name))
  where deleted_at is null;

create trigger set_updated_at before update on public.parties
  for each row execute function private.set_updated_at();

alter table public.parties enable row level security;