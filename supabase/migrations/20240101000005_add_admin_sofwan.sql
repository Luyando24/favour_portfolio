-- Add new admin user
insert into admins (email, password_hash)
values (
  'sofwan@rihlasoccer.com',
  extensions.crypt('Admin123', extensions.gen_salt('bf'))
)
on conflict (email) do nothing;
