begin;
create extension if not exists pgtap with schema extensions;
select plan(1);

select is(
  (select count(*) from pg_tables
   where schemaname = 'public' and not rowsecurity),
  0::bigint,
  'every table in public has RLS enabled'
);

select * from finish();
rollback;