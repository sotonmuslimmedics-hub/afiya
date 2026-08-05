-- Fixes "function gen_random_bytes(integer) does not exist" on
-- submit_concern. Supabase installs pgcrypto into the `extensions` schema,
-- not `public` — the function's `search_path = public` couldn't see it.
-- Safe to run even if 0001 already has this fix (idempotent).

create extension if not exists pgcrypto with schema extensions;

create or replace function submit_concern(p_category text, p_message text)
returns text
language plpgsql
security definer
set search_path = public, extensions
as $$
declare
  v_code text;
  v_id uuid;
  v_attempts int := 0;
begin
  if p_message is null or length(trim(p_message)) = 0 then
    raise exception 'A message is required';
  end if;
  if length(p_message) > 4000 then
    raise exception 'Message is too long';
  end if;
  if p_category not in ('academic', 'financial', 'wellbeing', 'faith', 'conduct', 'placement', 'other') then
    raise exception 'Invalid category';
  end if;

  loop
    v_code := 'AFY-' || upper(encode(extensions.gen_random_bytes(5), 'hex'));
    begin
      insert into concerns (code, category, message)
      values (v_code, p_category, trim(p_message))
      returning id into v_id;
      exit;
    exception when unique_violation then
      v_attempts := v_attempts + 1;
      if v_attempts > 5 then
        raise exception 'Could not generate a unique code, please try again';
      end if;
    end;
  end loop;

  return v_code;
end;
$$;

revoke all on function submit_concern(text, text) from public;
grant execute on function submit_concern(text, text) to anon, authenticated;
