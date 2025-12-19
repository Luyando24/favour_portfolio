-- Create 'videos' bucket if it doesn't exist
insert into storage.buckets (id, name, public)
values ('videos', 'videos', true)
on conflict (id) do nothing;

-- Create 'photos' bucket if it doesn't exist
insert into storage.buckets (id, name, public)
values ('photos', 'photos', true)
on conflict (id) do nothing;

-- Enable RLS on storage.objects if not already enabled (it usually is)
-- alter table storage.objects enable row level security;

-- Drop existing policies to avoid conflicts if re-running
drop policy if exists "Public Access" on storage.objects;
drop policy if exists "Authenticated Insert" on storage.objects;
drop policy if exists "Authenticated Update" on storage.objects;
drop policy if exists "Authenticated Delete" on storage.objects;

-- Policy to allow public access to 'videos' and 'photos'
create policy "Public Access"
  on storage.objects for select
  using ( bucket_id in ('videos', 'photos') );

-- Policy to allow authenticated users to upload to 'videos' and 'photos'
create policy "Authenticated Insert"
  on storage.objects for insert
  to authenticated
  with check ( bucket_id in ('videos', 'photos') );

create policy "Authenticated Update"
  on storage.objects for update
  to authenticated
  using ( bucket_id in ('videos', 'photos') );

create policy "Authenticated Delete"
  on storage.objects for delete
  to authenticated
  using ( bucket_id in ('videos', 'photos') );
