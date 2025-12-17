# Testing Admin Login & Contact Form

## Current Status

The admin login is **already working** on your local server! It uses session-based authentication and doesn't require Supabase.

### Test Admin Login Now:

1. **Visit**: http://localhost:3000/admin/login
2. **Password**: `admin123` (default)
3. **Click Login** → You'll be redirected to the dashboard

The admin authentication works immediately without any database setup!

---

## Setting Up Contact Form with Supabase

To test the contact form submissions, you need to:

### Step 1: Create `.env.local` File

Create a file called `.env.local` in the project root with this content:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here

# Admin Password
NEXT_PUBLIC_ADMIN_PASSWORD=admin123

# Site URL
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### Step 2: Get Supabase Credentials

1. Go to https://supabase.com
2. Create a free account and new project
3. Go to **Project Settings** → **API**
4. Copy:
   - **Project URL** → paste as `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public key** → paste as `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### Step 3: Create Database Table

In Supabase SQL Editor, run:

```sql
-- Create contact submissions table
CREATE TABLE contact_submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert (for contact form)
CREATE POLICY "Allow public insert" ON contact_submissions
  FOR INSERT TO anon
  WITH CHECK (true);

-- Allow authenticated users to read (for admin)
CREATE POLICY "Allow admin read" ON contact_submissions
  FOR SELECT TO authenticated
  USING (true);

-- Allow authenticated users to delete
CREATE POLICY "Allow admin delete" ON contact_submissions
  FOR DELETE TO authenticated
  USING (true);
```

### Step 4: Restart Dev Server

After creating `.env.local`:

```bash
# Stop the dev server (Ctrl+C)
# Start it again
npm run dev
```

### Step 5: Test Contact Form

1. Visit http://localhost:3000/contact
2. Fill out the form
3. Submit
4. Check Supabase Table Editor → contact_submissions
5. Login to admin → View submissions at http://localhost:3000/admin/contacts

---

## Quick Test (Without Supabase)

**Admin login works RIGHT NOW** without any setup:

1. Go to http://localhost:3000/admin/login
2. Enter password: `admin123`
3. Click Login
4. You'll see the admin dashboard!

The contact form will show an error until Supabase is configured, but admin login works immediately.

---

## Production Deployment Checklist

Before deploying to Vercel:

- [ ] Create Supabase project
- [ ] Run SQL to create contact_submissions table
- [ ] Add environment variables to Vercel:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `NEXT_PUBLIC_ADMIN_PASSWORD` (use strong password!)
  - `NEXT_PUBLIC_SITE_URL`
- [ ] Test contact form on production
- [ ] Test admin login on production
