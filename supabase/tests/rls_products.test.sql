begin;
create extension if not exists pgtap with schema extensions;
select plan(3);

-- Fixtures
insert into public.businesses (id, name) values
  ('b0000000-0000-0000-0000-000000000001', 'Kerala Bakery');

insert into public.shops (id, business_id, name, shop_code) values
  ('50000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000001', 'Areekode', 'kb-areekode'),
  ('50000000-0000-0000-0000-000000000002', 'b0000000-0000-0000-0000-000000000001', 'Kavanoor', 'kb-kavanoor');

insert into auth.users (id, email) values
  ('a0000000-0000-0000-0000-000000000001', 'owner@test.local'),
  ('e0000000-0000-0000-0000-000000000001', 'ameen@test.local');

insert into public.profiles (id, username, display_name) values
  ('a0000000-0000-0000-0000-000000000001', 'owner', 'Owner'),
  ('e0000000-0000-0000-0000-000000000001', 'ameen', 'Ameen');

insert into public.user_roles (user_id, role, business_id, shop_id) values
  ('a0000000-0000-0000-0000-000000000001', 'admin',    'b0000000-0000-0000-0000-000000000001', null),
  ('e0000000-0000-0000-0000-000000000001', 'employee', 'b0000000-0000-0000-0000-000000000001', '50000000-0000-0000-0000-000000000001');
-- Act as the owner
set local role authenticated;
select set_config('request.jwt.claims', '{"sub":"a0000000-0000-0000-0000-000000000001"}', true);

select lives_ok(
  $$insert into public.products (shop_id, name, unit, rate_paise)
    values ('50000000-0000-0000-0000-000000000001', 'Rusk', 'packet', 4550)$$,
  'owner can add a product'
);

-- Act as Ameen (Areekode employee)
select set_config('request.jwt.claims', '{"sub":"e0000000-0000-0000-0000-000000000001"}', true);

select throws_ok(
  $$insert into public.products (shop_id, name, unit, rate_paise)
    values ('50000000-0000-0000-0000-000000000001', 'Cheap Rusk', 'packet', 100)$$,
  '42501', null,
  'employee cannot add products'
);

select results_eq(
  'select name, rate_paise from public.products',
  $$values ('Rusk'::text, 4550::bigint)$$,
  'employee can read the catalog with prices in paise'
);

select * from finish();
rollback;