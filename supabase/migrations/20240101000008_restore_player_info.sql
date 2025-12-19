-- Restore player_info table if it was somehow deleted or corrupted
create table if not exists player_info (
  id uuid default extensions.uuid_generate_v4() primary key,
  full_name text not null,
  age text,
  dob text,
  place_of_birth text,
  height text,
  weight text,
  nationality text[], -- Array of strings
  languages text[], -- Array of strings
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

do $$
begin
  if not exists (
    select 1 from pg_policies where tablename = 'player_info' and policyname = 'Enable all access'
  ) then
    create policy "Enable all access" on player_info for all using (true);
  end if;
end $$;

-- Ensure hero_image_url column exists (if table already existed from old migration without it)
do $$
begin
  if not exists (select 1 from information_schema.columns where table_name = 'player_info' and column_name = 'hero_image_url') then
    alter table player_info add column hero_image_url text;
  end if;
end $$;

-- Seed data if empty
do $$
begin
  if not exists (select 1 from player_info) then
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
  end if;
end $$;
