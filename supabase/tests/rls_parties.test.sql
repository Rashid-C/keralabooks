begin;
select plan(5);
select tests.create_fixtures();

-- Act as Ameen (Areekode employee)
select tests.authenticate_as('e0000000-0000-0000-0000-000000000001');

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
select tests.authenticate_as('a0000000-0000-0000-0000-000000000001');
update public.parties set phone = '9876543210' where id = 'c0000000-0000-0000-0000-000000000001';

reset role;
select is(
  (select updated_by from public.parties where id = 'c0000000-0000-0000-0000-000000000001'),
  'a0000000-0000-0000-0000-000000000001'::uuid,
  'owner edit is stamped with the owner as updated_by'
);

select * from finish();
rollback;