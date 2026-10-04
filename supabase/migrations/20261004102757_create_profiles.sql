create table public.profiles (
  id                    uuid primary key references auth.users (id) on delete restrict,
  username              text not null check (username ~ '^[a-z0-9._]{3,30}$'),
  display_name          text not null check (length(trim(display_name)) between 1 and 60),
  is_active             boolean not null default true,
  must_change_password  boolean not null default false,
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now()
);

alter table public.profiles enable row level security;