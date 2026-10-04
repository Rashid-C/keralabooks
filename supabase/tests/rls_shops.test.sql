begin;
create extension if not exists pgtap with schema extensions;
select plan(3);

-- Fixtures: test data, created as the superuser
insert into public.businesses (id, name) values
  ('b0000000-0000-0000-0000-000000000001', 'Kerala Bakery'),
  ('b0000000-0000-0000-0000-000000000002', 'Other Bakery');

insert into public.shops (id, business_id, name, shop_code) values
  ('50000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000001', 'Areekode', 'kb-areekode'),
  ('50000000-0000-0000-0000-000000000002', 'b0000000-0000-0000-0000-000000000001', 'Kavanoor', 'kb-kavanoor'),
  ('50000000-0000-0000-0000-000000000003', 'b0000000-0000-0000-0000-000000000002', 'Other Shop', 'ob-main');

insert into auth.users (id, email) values
  ('a0000000-0000-0000-0000-000000000001', 'owner@test.local'),
  ('e0000000-0000-0000-0000-000000000001', 'ameen@test.local');

insert into public.profiles (id, username, display_name) values
  ('a0000000-0000-0000-0000-000000000001', 'owner', 'Owner'),
  ('e0000000-0000-0000-0000-000000000001', 'ameen', 'Ameen');

insert into public.user_roles (user_id, role, business_id, shop_id) values
  ('a0000000-0000-0000-0000-000000000001', 'admin',    'b0000000-0000-0000-0000-000000000001', null),
  ('e0000000-0000-0000-0000-000000000001', 'employee', 'b0000000-0000-0000-0000-000000000001', '50000000-0000-0000-0000-000000000001');

-- Test 1: logged-out visitor
set local role anon;
select is_empty('select * from public.shops', 'logged-out visitors see no shops');
reset role;

-- Test 2: Ameen, an Areekode employee
set local role authenticated;
select set_config('request.jwt.claims', '{"sub":"e0000000-0000-0000-0000-000000000001"}', true);
select results_eq(
  'select name from public.shops order by name',
    $$values ('Areekode')$$,
  'employee sees only their own shop'
);

-- Test 3: the owner
select set_config('request.jwt.claims', '{"sub":"a0000000-0000-0000-0000-000000000001"}', true);
select results_eq(
  'select name from public.shops order by name',
  $$values ('Areekode'), ('Kavanoor')$$,
  'owner sees both their shops, but not other businesses'
);

select * from finish();
rollback;