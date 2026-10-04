begin;
create extension if not exists pgtap with schema extensions;
select plan(5);

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

-- Act as Ameen (Areekode employee)
set local role authenticated;
select set_config('request.jwt.claims', '{"sub":"e0000000-0000-0000-0000-000000000001"}', true);

select lives_ok(
  $$insert into public.parties (id, shop_id, name)
    values ('c0000000-0000-0000-0000-000000000001', '50000000-0000-0000-0000-000000000001', 'Hotel Rahmath')$$,
  'employee can add a party to their own shop'
);

select throws_ok(
  $$insert into public.parties (shop_id, name)
    values ('50000000-0000-0000-0000-000000000002', 'Sneaky Party')$$,
  '42501', null,
  'employee cannot add a party to another shop'
);

select throws_ok(
  $$insert into public.parties (shop_id, name, created_by)
    values ('50000000-0000-0000-0000-000000000001', 'Fake Owner Party', 'a0000000-0000-0000-0000-000000000001')$$,
  '42501', null,
  'employee cannot fake created_by'
);

-- Employee tries to edit (RLS silently matches zero rows)
update public.parties set name = 'Changed' where id = 'c0000000-0000-0000-0000-000000000001';

reset role;
select is(
  (select name from public.parties where id = 'c0000000-0000-0000-0000-000000000001'),
  'Hotel Rahmath',
  'employee edit had no effect'
);

-- Act as the owner and edit
set local role authenticated;
select set_config('request.jwt.claims', '{"sub":"a0000000-0000-0000-0000-000000000001"}', true);
update public.parties set phone = '9876543210' where id = 'c0000000-0000-0000-0000-000000000001';

reset role;
select is(
  (select updated_by from public.parties where id = 'c0000000-0000-0000-0000-000000000001'),
  'a0000000-0000-0000-0000-000000000001'::uuid,
  'owner edit is stamped with the owner as updated_by'
);

select * from finish();
rollback;