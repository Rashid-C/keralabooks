begin;
select plan(5);
select tests.create_fixtures();

insert into public.parties (id, shop_id, name, created_by) values
  ('c0000000-0000-0000-0000-000000000001', '50000000-0000-0000-0000-000000000001', 'Hotel Rahmath', 'a0000000-0000-0000-0000-000000000001');

select tests.authenticate_as('e0000000-0000-0000-0000-000000000001');

-- 1. A bill with items: total comes from the lines
select public.create_entry(
  '50000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000001',
  'sale', '2026-10-05', 'T1', null, null,
  '[{"name":"Rusk","unit":"packet","qty":2,"rate_paise":4550},
    {"name":"Cake","unit":"kg","qty":0.5,"rate_paise":5000}]'::jsonb
);
select is(
  (select amount_paise from public.entries where bill_no = 'T1'),
  11600::bigint,
  'bill with items gets its total from the lines'
);

-- 2. A quick bill with no items: the entered amount is used
select public.create_entry(
  '50000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000001',
  'sale', '2026-10-05', 'T2', null, 50000, '[]'::jsonb
);
select is(
  (select amount_paise from public.entries where bill_no = 'T2'),
  50000::bigint,
  'bill without items keeps the entered amount'
);

-- 3. No items and no amount is rejected
select throws_ok(
  $$select public.create_entry(
      '50000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000001',
      'sale', '2026-10-05', 'T3', null, 0, '[]'::jsonb)$$,
  '22023', null,
  'empty bill is rejected'
);

-- 4. One bad line rejects the whole bill
select throws_ok(
  $$select public.create_entry(
      '50000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000001',
      'sale', '2026-10-05', 'T4', null, null,
      '[{"name":"Rusk","unit":"packet","qty":2,"rate_paise":4550},
        {"name":"Broken","unit":"pcs","qty":0,"rate_paise":100}]'::jsonb)$$,
  '23514', null,
  'a line with quantity 0 is rejected'
);

-- 5. ...and nothing from that bill was saved
select is(
  (select count(*) from public.entries where bill_no = 'T4'),
  0::bigint,
  'no partial bill is left behind'
);

select * from finish();
rollback;