alter table public.entries
  add constraint entries_id_shop_id_key unique (id, shop_id);

alter table public.products
  add constraint products_id_shop_id_key unique (id, shop_id);

create table public.entry_items (
  id                uuid primary key default gen_random_uuid(),
  entry_id          uuid not null,
  shop_id           uuid not null,
  product_id        uuid,
  position          smallint not null check (position >= 0),
  name              text not null check (length(trim(name)) between 1 and 80),
  unit              public.product_unit not null,
  qty               numeric(12, 3) not null check (qty > 0),
  rate_paise        bigint not null check (rate_paise >= 0),
  line_total_paise  bigint generated always as (round(qty * rate_paise)::bigint) stored,

  foreign key (entry_id, shop_id)
    references public.entries (id, shop_id) on delete cascade,
  foreign key (product_id, shop_id)
    references public.products (id, shop_id) on delete restrict
);

create index entry_items_entry_id_idx on public.entry_items (entry_id, position);
create index entry_items_shop_product_idx on public.entry_items (shop_id, product_id);

alter table public.entry_items enable row level security;