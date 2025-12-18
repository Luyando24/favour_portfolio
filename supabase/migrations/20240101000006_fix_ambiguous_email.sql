-- Fix "column reference 'email' is ambiguous" in admin_list_users
-- This happens because the return table has a column named 'email', which conflicts with 'admins.email' in the where clause.
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
  -- Qualified 'admins.email' to avoid ambiguity with return column 'email'
  if not exists (
    select 1 from admins
    where admins.email = p_operator_email
    and admins.password_hash = extensions.crypt(p_operator_password, admins.password_hash)
  ) then
    raise exception 'Unauthorized: Invalid operator credentials';
  end if;

  return query select a.id, a.email, a.created_at from admins a order by a.created_at desc;
end;
$$;
