create type public.product_unit as enum
  ('pcs', 'kg', 'g', 'litre', 'ml', 'dozen', 'box', 'packet', 'tray');

create table public.products (
  id          uuid primary key default gen_random_uuid(),
  shop_id     uuid not null references public.shops (id) on delete restrict,
  name        text not null check (length(trim(name)) between 1 and 80),
  unit        public.product_unit not null default 'pcs',
  rate_paise  bigint not null check (rate_paise >= 0),
  created_by  uuid not null default auth.uid() references public.profiles (id),
  updated_by  uuid references public.profiles (id),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  deleted_at  timestamptz
);

create unique index products_shop_name_key
  on public.products (shop_id, lower(name))
  where deleted_at is null;

create trigger set_updated_at before update on public.products
  for each row execute function private.set_updated_at();

create trigger protect_audit_fields before update on public.products
  for each row execute function private.protect_audit_fields();

alter table public.products enable row level security;