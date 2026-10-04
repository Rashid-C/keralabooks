create function public.create_entry(
  p_shop_id      uuid,
  p_party_id     uuid,
  p_type         public.entry_type,
  p_entry_date   date,
  p_bill_no      text,
  p_note         text,
  p_amount_paise bigint,
  p_items        jsonb
)
returns uuid
language plpgsql
security invoker
set search_path = ''
as $$
declare
  v_entry_id uuid;
  v_item_count int := coalesce(jsonb_array_length(p_items), 0);
begin
  if v_item_count > 100 then
    raise exception 'A bill can have at most 100 items' using errcode = '22023';
  end if;
  if v_item_count = 0 and coalesce(p_amount_paise, 0) <= 0 then
    raise exception 'Add items or enter an amount' using errcode = '22023';
  end if;

  insert into public.entries (shop_id, party_id, type, entry_date, bill_no, note, amount_paise)
  values (
    p_shop_id, p_party_id, p_type, p_entry_date,
    nullif(trim(p_bill_no), ''), nullif(trim(p_note), ''),
    case when v_item_count = 0 then p_amount_paise else 0 end
  )
  returning id into v_entry_id;

  if v_item_count > 0 then
    insert into public.entry_items (entry_id, shop_id, product_id, position, name, unit, qty, rate_paise)
    select
      v_entry_id,
      p_shop_id,
      (item ->> 'product_id')::uuid,
      (ord - 1)::smallint,
      item ->> 'name',
      (item ->> 'unit')::public.product_unit,
      (item ->> 'qty')::numeric,
      (item ->> 'rate_paise')::bigint
    from jsonb_array_elements(p_items) with ordinality as t(item, ord);
  end if;

  return v_entry_id;
end;
$$;

revoke execute on function public.create_entry from public, anon;
grant execute on function public.create_entry to authenticated;