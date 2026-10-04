begin;
select plan(4);
select tests.create_fixtures();

-- Test 1: logged-out visitor
set local role anon;
select is_empty('select * from public.shops', 'logged-out visitors see no shops');
reset role;

-- Test 2: Ameen, an Areekode employee
select tests.authenticate_as('e0000000-0000-0000-0000-000000000001');
select results_eq(
  'select name from public.shops order by name',
  $$values ('Areekode')$$,
  'employee sees only their own shop'
);

-- Test 3: the owner
select tests.authenticate_as('a0000000-0000-0000-0000-000000000001');
select results_eq(
  'select name from public.shops order by name',
  $$values ('Areekode'), ('Kavanoor')$$,
  'owner sees both their shops, but not other businesses'
);

-- Test 4: Ameen after being deactivated
reset role;
update public.profiles set is_active = false
where id = 'e0000000-0000-0000-0000-000000000001';

select tests.authenticate_as('e0000000-0000-0000-0000-000000000001');
select is_empty(
  'select * from public.shops',
  'deactivated employee sees no shops, even with a valid token'
);

select * from finish();
rollback;