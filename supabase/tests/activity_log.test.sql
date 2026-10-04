begin;
select plan(4);
select tests.create_fixtures();

-- Ameen adds a party
select tests.authenticate_as('e0000000-0000-0000-0000-000000000001');
insert into public.parties (id, shop_id, name)
values ('c0000000-0000-0000-0000-000000000001', '50000000-0000-0000-0000-000000000001', 'Hotel Rahmath');

select is_empty(
  'select * from public.activity_log',
  'employees cannot read the activity log'
);

select throws_ok(
  $$insert into public.activity_log (shop_id, action, table_name, record_id)
    values ('50000000-0000-0000-0000-000000000001', 'insert', 'parties', gen_random_uuid())$$,
  '42501', null,
  'nobody can write fake log entries'
);

-- The owner checks the log
select tests.authenticate_as('a0000000-0000-0000-0000-000000000001');

select results_eq(
  $$select actor_id, action, table_name, new_data ->> 'name'
    from public.activity_log$$,
  $$values ('e0000000-0000-0000-0000-000000000001'::uuid, 'insert'::text, 'parties'::text, 'Hotel Rahmath'::text)$$,
  'owner sees that Ameen added Hotel Rahmath'
);

select is(
  (select count(*) from public.activity_log where record_id = 'c0000000-0000-0000-0000-000000000001'),
  1::bigint,
  'exactly one log entry was recorded'
);

select * from finish();
rollback;