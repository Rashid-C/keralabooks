create type public.app_role as enum ('super_admin', 'admin', 'employee');

alter table public.shops
  add constraint shops_id_business_id_key unique (id, business_id);

create table public.user_roles (
  user_id      uuid primary key references public.profiles (id) on delete restrict,
  role         public.app_role not null,
  business_id  uuid references public.businesses (id) on delete restrict,
  shop_id      uuid,
  created_at   timestamptz not null default now(),

  foreign key (shop_id, business_id)
    references public.shops (id, business_id) on delete restrict,

  check (
    (role = 'super_admin' and business_id is null     and shop_id is null) or
    (role = 'admin'       and business_id is not null and shop_id is null) or
    (role = 'employee'    and business_id is not null and shop_id is not null)
  )
);

create index user_roles_business_id_idx on public.user_roles (business_id);
create index user_roles_shop_id_idx on public.user_roles (shop_id);

alter table public.user_roles enable row level security;