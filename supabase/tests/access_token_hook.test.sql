begin;
select plan(4);
select tests.create_fixtures();

select is(
  public.custom_access_token_hook(jsonb_build_object(
    'user_id', 'e0000000-0000-0000-0000-000000000001',
    'claims',  jsonb_build_object('role', 'authenticated')
  )) -> 'claims' ->> 'app_role',
  'employee',
  'token says Ameen is an employee'
);

select is(
  public.custom_access_token_hook(jsonb_build_object(
    'user_id', 'e0000000-0000-0000-0000-000000000001',
    'claims',  jsonb_build_object('role', 'authenticated')
  )) -> 'claims' ->> 'shop_id',
  '50000000-0000-0000-0000-000000000001',
  'token carries Ameen''s shop'
);

select is(
  public.custom_access_token_hook(jsonb_build_object(
    'user_id', 'e0000000-0000-0000-0000-000000000001',
    'claims',  jsonb_build_object('role', 'authenticated')
  )) -> 'claims' ->> 'role',
  'authenticated',
  'the original role claim is untouched'
);

select tests.authenticate_as('e0000000-0000-0000-0000-000000000001');
select throws_ok(
  $$select public.custom_access_token_hook('{}'::jsonb)$$,
  '42501', null,
  'app users cannot call the hook'
);

select * from finish();
rollback;