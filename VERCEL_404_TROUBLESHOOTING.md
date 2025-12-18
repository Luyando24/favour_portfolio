# Vercel 404 Troubleshooting Guide

## What to Check

### 1. Verify Your Deployment URL
Your Vercel deployment URL should look like:
- `https://favour-anekwe.vercel.app` or
- `https://yourproject-name-hash.vercel.app`

**NOT** just `https://vercel.app`

### 2. Check What's Failing

Open your browser DevTools (Press F12), then:

1. **Console Tab** - Look for errors like:
   ```
   Failed to load resource: the server responded with a status of 404 ()
   GET https://your-site.vercel.app/some-file.jpg 404
   ```

2. **Network Tab** - Refresh the page and look for:
   - Red/failed requests (404 status)
   - Note which files are failing

### 3. Common Issues

**If the homepage itself is 404:**
- Wrong URL - check your Vercel dashboard for correct deployment URL
- Build failed - check Vercel build logs

**If images/videos are 404:**
- Files have spaces in names (needs URL encoding)
- Files not pushed to Git
- Files in wrong directory

## Current Status

✅ **Confirmed Working:**
- Production build successful
- All code pushed to GitHub
- Files exist in `public/gallery/photos/` (60 photos)
- Files exist in `public/gallery/videos/` (15 videos)
- Hero image exists at `public/images/hero-bg.jpg`

⚠️ **Potential Issues:**
- Filenames contain spaces (e.g., "WhatsApp Image 2025-11-21 at 16.49.15_08e154fe.jpg")
- These need to be URL-encoded as `%20` when accessed via HTTP

## Next Steps

Please provide:
1. ✉️ Your exact Vercel deployment URL
2. 📸 Screenshot of browser Console showing the 404 error
3. 🔍 The exact URL of the resource that's failing (from DevTools Network tab)

With this info, I can quickly identify and fix the exact issue!
