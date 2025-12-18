-- Fix storage policies to allow uploads for authenticated admin (via session) or anon
-- Since we are using a custom auth mechanism (session storage) without Supabase Auth session,
-- the Supabase client is technically 'anon'.
-- So we must allow 'anon' to insert/update/delete in these buckets.

drop policy if exists "Authenticated Insert" on storage.objects;
drop policy if exists "Authenticated Update" on storage.objects;
drop policy if exists "Authenticated Delete" on storage.objects;

-- Allow anyone (public/anon) to upload to 'videos' and 'photos'
-- In a stricter production environment, we would require a valid Supabase JWT.
create policy "Public Insert"
  on storage.objects for insert
  with check ( bucket_id in ('videos', 'photos') );

create policy "Public Update"
  on storage.objects for update
  using ( bucket_id in ('videos', 'photos') );

create policy "Public Delete"
  on storage.objects for delete
  using ( bucket_id in ('videos', 'photos') );
