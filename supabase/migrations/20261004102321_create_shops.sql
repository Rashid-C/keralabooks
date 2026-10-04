create type public.shop_status as enum ('active', 'inactive');

create table public.shops (
  id           uuid primary key default gen_random_uuid(),
  business_id  uuid not null references public.businesses (id) on delete restrict,
  name         text not null check (length(trim(name)) between 2 and 80),
  shop_code    text not null unique check (shop_code ~ '^[a-z0-9-]{3,20}$'),
  timezone     text not null default 'Asia/Kolkata',
  status       public.shop_status not null default 'active',
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now(),
  unique (business_id, name)
);

create index shops_business_id_idx on public.shops (business_id);

alter table public.shops enable row level security;