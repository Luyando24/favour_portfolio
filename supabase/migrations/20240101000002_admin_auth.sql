-- Enable pgcrypto for hashing
create extension if not exists "pgcrypto" with schema extensions;

-- Create Admins table
create table if not exists admins (
  id uuid default extensions.uuid_generate_v4() primary key,
  email text not null unique,
  password_hash text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS (but we will mostly use RPCs)
alter table admins enable row level security;

-- Policy: No one can read/write directly via API (default deny)
-- We use SECURITY DEFINER functions to bypass this for specific operations

-- RPC: Login
create or replace function admin_login(p_email text, p_password text)
returns boolean
language plpgsql
security definer
as $$
begin
  return exists (
    select 1 from admins
    where email = p_email
    and password_hash = extensions.crypt(p_password, password_hash)
  );
end;
$$;

-- RPC: Create Admin (Requires valid admin credentials to authorize)
create or replace function admin_create_user(
  p_operator_email text,
  p_operator_password text,
  p_new_email text,
  p_new_password text
)
returns void
language plpgsql
security definer
as $$
begin
  -- Verify operator credentials
  if not exists (
    select 1 from admins
    where email = p_operator_email
    and password_hash = extensions.crypt(p_operator_password, password_hash)
  ) then
    raise exception 'Unauthorized: Invalid operator credentials';
  end if;

  -- Insert new admin
  insert into admins (email, password_hash)
  values (p_new_email, extensions.crypt(p_new_password, extensions.gen_salt('bf')));
end;
$$;

-- RPC: List Admins (Requires valid admin credentials)
create or replace function admin_list_users(
  p_operator_email text,
  p_operator_password text
)
returns table (id uuid, email text, created_at timestamptz)
language plpgsql
security definer
as $$
begin
  -- Verify operator credentials
  if not exists (
    select 1 from admins
    where email = p_operator_email
    and password_hash = extensions.crypt(p_operator_password, password_hash)
  ) then
    raise exception 'Unauthorized: Invalid operator credentials';
  end if;

  return query select a.id, a.email, a.created_at from admins a order by a.created_at desc;
end;
$$;

-- RPC: Delete Admin (Requires valid admin credentials)
create or replace function admin_delete_user(
  p_operator_email text,
  p_operator_password text,
  p_target_id uuid
)
returns void
language plpgsql
security definer
as $$
declare
  v_count int;
begin
  -- Verify operator credentials
  if not exists (
    select 1 from admins
    where email = p_operator_email
    and password_hash = extensions.crypt(p_operator_password, password_hash)
  ) then
    raise exception 'Unauthorized: Invalid operator credentials';
  end if;

  -- Prevent deleting the last admin
  select count(*) into v_count from admins;
  if v_count <= 1 then
    raise exception 'Cannot delete the last admin account';
  end if;

  delete from admins where id = p_target_id;
end;
$$;

-- Seed Default Admin (only if table is empty)
do $$
begin
  if not exists (select 1 from admins) then
    insert into admins (email, password_hash)
    values ('admin@favouranekwe.com', extensions.crypt('admin123', extensions.gen_salt('bf')));
  end if;
end $$;
