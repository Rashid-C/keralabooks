create function private.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

create trigger set_updated_at before update on public.businesses
  for each row execute function private.set_updated_at();

create trigger set_updated_at before update on public.shops
  for each row execute function private.set_updated_at();

create trigger set_updated_at before update on public.profiles
  for each row execute function private.set_updated_at();