# Supabase Setup Guide

## Quick Setup

### 1. Create Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Note your project URL and anon key

### 2. Create Database Tables

Run this SQL in Supabase SQL Editor:

```sql
-- Contact Submissions Table
CREATE TABLE contact_submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;

-- Allow public insert (for contact form)
CREATE POLICY "Allow public insert" ON contact_submissions
  FOR INSERT TO anon
  WITH CHECK (true);

-- Allow authenticated read (for admin)
CREATE POLICY "Allow admin read" ON contact_submissions
  FOR SELECT TO authenticated
  USING (true);

-- Allow authenticated delete (for admin)
CREATE POLICY "Allow admin delete" ON contact_submissions
  FOR DELETE TO authenticated
  USING (true);
```

### 3. Configure Environment Variables

Create `.env.local` in project root:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
NEXT_PUBLIC_ADMIN_PASSWORD=your_secure_password
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 4. Test Contact Form

1. Visit http://localhost:3000/contact
2. Fill out and submit the form
3. Check Supabase dashboard → Table Editor → contact_submissions
4. Login to admin at http://localhost:3000/admin/login
5. View submissions at http://localhost:3000/admin/contacts

## Admin Access

- **Login URL**: http://localhost:3000/admin/login
- **Default Password**: Set in NEXT_PUBLIC_ADMIN_PASSWORD
- **Dashboard**: http://localhost:3000/admin/dashboard

## Security Notes

> **IMPORTANT**: The current admin authentication is demo-only using session storage.
> For production, implement proper Supabase Auth with email/password or OAuth.

### Production Checklist
- [ ] Set strong ADMIN_PASSWORD in .env.local
- [ ] Never commit .env.local to git
- [ ] Implement Supabase Auth for admin users
- [ ] Set up proper RLS policies
- [ ] Enable 2FA for Supabase project
- [ ] Use environment variables in Vercel deployment
