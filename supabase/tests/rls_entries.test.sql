begin;
select plan(5);
select tests.create_fixtures();

-- More fixtures: a party, the owner's bill, and an old bill by Ameen
insert into public.parties (id, shop_id, name, created_by) values
  ('c0000000-0000-0000-0000-000000000001', '50000000-0000-0000-0000-000000000001', 'Hotel Rahmath', 'a0000000-0000-0000-0000-000000000001');

insert into public.entries (id, shop_id, party_id, type, entry_date, created_by, created_at) values
  ('d0000000-0000-0000-0000-000000000001', '50000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000001',
   'sale', '2026-10-01', 'a0000000-0000-0000-0000-000000000001', now()),
  ('d0000000-0000-0000-0000-000000000002', '50000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000001',
   'sale', '2026-10-01', 'e0000000-0000-0000-0000-000000000001', now() - interval '1 hour');

-- Act as Ameen
select tests.authenticate_as('e0000000-0000-0000-0000-000000000001');

select lives_ok(
  $$insert into public.entries (id, shop_id, party_id, type, entry_date)
    values ('d0000000-0000-0000-0000-000000000003', '50000000-0000-0000-0000-000000000001',
            'c0000000-0000-0000-0000-000000000001', 'sale', '2026-10-05')$$,
  'employee can record a new sale'
);

select lives_ok(
  $$insert into public.entry_items (entry_id, shop_id, position, name, unit, qty, rate_paise) values
    ('d0000000-0000-0000-0000-000000000003', '50000000-0000-0000-0000-000000000001', 0, 'Rusk', 'packet', 2,   4550),
    ('d0000000-0000-0000-0000-000000000003', '50000000-0000-0000-0000-000000000001', 1, 'Cake', 'kg',     0.5, 5000)$$,
  'employee can add lines to their own new bill'
);

select throws_ok(
  $$insert into public.entry_items (entry_id, shop_id, position, name, unit, qty, rate_paise)
    values ('d0000000-0000-0000-0000-000000000001', '50000000-0000-0000-0000-000000000001', 0, 'Extra', 'pcs', 1, 100)$$,
  '42501', null,
  'employee cannot add lines to the owner''s bill'
);

select throws_ok(
  $$insert into public.entry_items (entry_id, shop_id, position, name, unit, qty, rate_paise)
    values ('d0000000-0000-0000-0000-000000000002', '50000000-0000-0000-0000-000000000001', 0, 'Extra', 'pcs', 1, 100)$$,
  '42501', null,
  'employee cannot add lines to their own old bill'
);

-- Check the total as superuser
reset role;
select is(
  (select amount_paise from public.entries where id = 'd0000000-0000-0000-0000-000000000003'),
  11600::bigint,
  'bill total is calculated by the database: 2 x 45.50 + 0.5 x 50.00 = 116.00'
);

select * from finish();
rollback;