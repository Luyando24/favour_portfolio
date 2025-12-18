-- Fix missing columns in player_info table
ALTER TABLE player_info
ADD COLUMN IF NOT EXISTS hero_image_url text,
ADD COLUMN IF NOT EXISTS dob text,
ADD COLUMN IF NOT EXISTS place_of_birth text;

-- Ensure storage buckets exist and are public
insert into storage.buckets (id, name, public)
values ('photos', 'photos', true)
on conflict (id) do nothing;

insert into storage.buckets (id, name, public)
values ('videos', 'videos', true)
on conflict (id) do nothing;

-- Ensure RLS policies allow access
alter table storage.objects enable row level security;

create policy "Public Access"
  on storage.objects for select
  using ( bucket_id in ('videos', 'photos') );

create policy "Public Insert"
  on storage.objects for insert
  with check ( bucket_id in ('videos', 'photos') );

create policy "Public Update"
  on storage.objects for update
  using ( bucket_id in ('videos', 'photos') );

create policy "Public Delete"
  on storage.objects for delete
  using ( bucket_id in ('videos', 'photos') );
