create function private.recalculate_entry_amount()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if tg_op <> 'DELETE' then
    update public.entries
    set amount_paise = (
      select coalesce(sum(line_total_paise), 0)
      from public.entry_items
      where entry_id = new.entry_id
    )
    where id = new.entry_id;
  end if;

  if tg_op <> 'INSERT' then
    update public.entries
    set amount_paise = (
      select coalesce(sum(line_total_paise), 0)
      from public.entry_items
      where entry_id = old.entry_id
    )
    where id = old.entry_id;
  end if;

  return null;
end;
$$;

create trigger recalculate_entry_amount
after insert or update or delete on public.entry_items
for each row execute function private.recalculate_entry_amount();