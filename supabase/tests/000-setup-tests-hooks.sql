create extension if not exists pgtap with schema extensions;

create schema if not exists tests;
grant usage on schema tests to authenticated;

create or replace function tests.create_fixtures()
returns void
language sql
as $$
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
$$;

create or replace function tests.authenticate_as(user_id uuid)
returns void
language plpgsql
as $$
begin
  perform set_config('role', 'authenticated', true);
  perform set_config('request.jwt.claims', json_build_object('sub', user_id)::text, true);
end;
$$;

grant execute on function tests.authenticate_as(uuid) to authenticated;

begin;
select plan(1);
select ok(true, 'test helpers installed');
select * from finish();
rollback;