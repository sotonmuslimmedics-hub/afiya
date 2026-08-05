-- Afiya — anonymous welfare line schema
--
-- Security model:
--   * Students are never authenticated. The anon key can call the RPC
--     functions below, but has NO direct SELECT/INSERT/UPDATE grant on
--     `concerns` or `replies` — RLS blocks all direct table access for
--     the anon role. This makes it impossible to dump the table or browse
--     other students' concerns; the only way in is a concern code, checked
--     one row at a time inside a SECURITY DEFINER function.
--   * Concern codes are 10 random hex characters (16^10 ≈ 1.1e12
--     combinations) generated with pgcrypto's CSPRNG, so guessing a code
--     is not practical.
--   * Welfare Team members are ordinary Supabase Auth users (created by
--     an admin via the dashboard — there is no public sign-up). Any
--     authenticated user may read the inbox/thread and use the welfare
--     RPCs; access control therefore boils down to "who has an account",
--     which you manage by inviting people in the Supabase dashboard.

-- Supabase installs pgcrypto into the `extensions` schema by default, not
-- `public` — pin it explicitly so this is deterministic regardless of the
-- search_path active when this migration runs.
create extension if not exists pgcrypto with schema extensions;

create table if not exists concerns (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  category text not null check (
    category in ('academic', 'financial', 'wellbeing', 'faith', 'conduct', 'placement', 'other')
  ),
  message text not null,
  status text not null default 'needs_reply' check (
    status in ('needs_reply', 'answered', 'resolved')
  ),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists concerns_status_idx on concerns (status);
create index if not exists concerns_created_at_idx on concerns (created_at);

create table if not exists replies (
  id uuid primary key default gen_random_uuid(),
  concern_id uuid not null references concerns (id) on delete cascade,
  sender text not null check (sender in ('student', 'welfare')),
  message text not null,
  created_at timestamptz not null default now()
);

create index if not exists replies_concern_id_idx on replies (concern_id, created_at);

alter table concerns enable row level security;
alter table replies enable row level security;

-- Welfare Team (any authenticated user) can read everything. There are
-- deliberately no INSERT/UPDATE/DELETE policies here — all writes go
-- through the RPC functions below so we can enforce invariants (e.g. a
-- welfare reply can't be inserted with sender = 'student').
create policy "welfare team can read concerns"
  on concerns for select
  to authenticated
  using (true);

create policy "welfare team can read replies"
  on replies for select
  to authenticated
  using (true);

-- ─────────────────────────────────────────────────────────────
-- Status bump: whenever a reply is added, move the concern to
-- 'needs_reply' (student replied) or 'answered' (welfare replied).
-- ─────────────────────────────────────────────────────────────
create or replace function bump_concern_status()
returns trigger
language plpgsql
as $$
begin
  update concerns
  set status = case when new.sender = 'welfare' then 'answered' else 'needs_reply' end,
      updated_at = now()
  where id = new.concern_id;
  return new;
end;
$$;

drop trigger if exists trg_bump_concern_status on replies;
create trigger trg_bump_concern_status
  after insert on replies
  for each row execute function bump_concern_status();

-- ─────────────────────────────────────────────────────────────
-- Student RPCs (SECURITY DEFINER — bypass RLS, but only ever
-- touch the one row identified by the code the caller supplied).
-- ─────────────────────────────────────────────────────────────

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

create or replace function get_thread_by_code(p_code text)
returns json
language plpgsql
security definer
set search_path = public
as $$
declare
  v_code text := upper(trim(p_code));
  v_concern concerns%rowtype;
  v_result json;
begin
  select * into v_concern from concerns where code = v_code;
  if not found then
    return null;
  end if;

  select json_build_object(
    'code', v_concern.code,
    'category', v_concern.category,
    'message', v_concern.message,
    'status', v_concern.status,
    'created_at', v_concern.created_at,
    'replies', coalesce(
      (select json_agg(
          json_build_object('sender', r.sender, 'message', r.message, 'created_at', r.created_at)
          order by r.created_at
        )
       from replies r where r.concern_id = v_concern.id),
      '[]'::json
    )
  )
  into v_result;

  return v_result;
end;
$$;

revoke all on function get_thread_by_code(text) from public;
grant execute on function get_thread_by_code(text) to anon, authenticated;

create or replace function add_student_reply(p_code text, p_message text)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_code text := upper(trim(p_code));
  v_id uuid;
begin
  if p_message is null or length(trim(p_message)) = 0 then
    raise exception 'A message is required';
  end if;
  if length(p_message) > 4000 then
    raise exception 'Message is too long';
  end if;

  select id into v_id from concerns where code = v_code;
  if not found then
    raise exception 'Concern not found';
  end if;

  insert into replies (concern_id, sender, message) values (v_id, 'student', trim(p_message));
end;
$$;

revoke all on function add_student_reply(text, text) from public;
grant execute on function add_student_reply(text, text) to anon, authenticated;

-- ─────────────────────────────────────────────────────────────
-- Welfare Team RPCs (authenticated only).
-- ─────────────────────────────────────────────────────────────

create or replace function welfare_send_reply(p_concern_id uuid, p_message text)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if auth.role() <> 'authenticated' then
    raise exception 'Not authorized';
  end if;
  if p_message is null or length(trim(p_message)) = 0 then
    raise exception 'A message is required';
  end if;
  if length(p_message) > 4000 then
    raise exception 'Message is too long';
  end if;

  insert into replies (concern_id, sender, message) values (p_concern_id, 'welfare', trim(p_message));
end;
$$;

revoke all on function welfare_send_reply(uuid, text) from public;
grant execute on function welfare_send_reply(uuid, text) to authenticated;

create or replace function set_concern_status(p_id uuid, p_status text)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if auth.role() <> 'authenticated' then
    raise exception 'Not authorized';
  end if;
  if p_status not in ('answered', 'resolved') then
    raise exception 'Invalid status';
  end if;

  update concerns set status = p_status, updated_at = now() where id = p_id;
end;
$$;

revoke all on function set_concern_status(uuid, text) from public;
grant execute on function set_concern_status(uuid, text) to authenticated;
