with kb as (
  insert into public.businesses (name) values ('Kerala Bakery')
  returning id
)
insert into public.shops (business_id, name, shop_code)
select kb.id, s.name, s.code
from kb,
     (values ('Areekode', 'kb-areekode'), ('Kavanoor', 'kb-kavanoor')) as s(name, code)
returning name, shop_code, timezone;