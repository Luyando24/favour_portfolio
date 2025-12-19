-- Re-run force recreate of player_info table
drop table if exists player_info cascade;

create table player_info (
  id uuid default extensions.uuid_generate_v4() primary key,
  full_name text not null,
  age text,
  dob text,
  place_of_birth text,
  height text,
  weight text,
  nationality text[],
  languages text[],
  position text,
  footedness text,
  location text,
  tagline text,
  email text,
  phone text,
  whatsapp text,
  instagram text,
  youtube text,
  hero_image_url text,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table player_info enable row level security;

-- Create policy
create policy "Enable all access" on player_info for all using (true);

-- Grant permissions explicitly
grant all on table player_info to anon, authenticated, service_role;

-- Insert seed data
insert into player_info (
  full_name,
  age,
  dob,
  place_of_birth,
  height,
  weight,
  nationality,
  languages,
  position,
  footedness,
  location,
  tagline,
  email,
  phone,
  whatsapp,
  instagram,
  youtube,
  hero_image_url
) values (
  'Favour Chinelo Anekwe',
  '25',
  '07/07/2004',
  'Anambra, Nigeria',
  '166cm',
  '64kg',
  ARRAY['Nigerian'],
  ARRAY['English', 'Chinese'],
  'Forward (Striker)',
  'Right Foot',
  'Hangzhou, China',
  'Motivated, physically fit, and creative footballer committed to excellence.',
  'gentlegentlemoon@gmail.com',
  '(+86) 18536223834',
  '(+86) 18536223834',
  'https://www.instagram.com/Favour_gentle',
  '',
  '/images/cover.jpeg'
);
