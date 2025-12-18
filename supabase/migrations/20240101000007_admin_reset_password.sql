-- RPC: Reset Admin Password (without email verification)
create or replace function admin_reset_password(
  p_operator_email text,
  p_operator_password text,
  p_target_id uuid,
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
    where admins.email = p_operator_email
    and admins.password_hash = extensions.crypt(p_operator_password, admins.password_hash)
  ) then
    raise exception 'Unauthorized: Invalid operator credentials';
  end if;

  -- Update password
  update admins
  set password_hash = extensions.crypt(p_new_password, extensions.gen_salt('bf'))
  where id = p_target_id;
end;
$$;
