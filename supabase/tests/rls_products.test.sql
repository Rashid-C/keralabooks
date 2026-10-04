begin;
select plan(3);
select tests.create_fixtures();

-- Act as the owner
select tests.authenticate_as('a0000000-0000-0000-0000-000000000001');

select lives_ok(
  $$insert into public.products (shop_id, name, unit, rate_paise)
    values ('50000000-0000-0000-0000-000000000001', 'Rusk', 'packet', 4550)$$,
  'owner can add a product'
);

-- Act as Ameen (Areekode employee)
select tests.authenticate_as('e0000000-0000-0000-0000-000000000001');

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