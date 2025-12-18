-- DANGER: This script will delete all tables and data in the database.
-- Run this only if you want to start with a fresh database for Favour Anekwe.

DROP TABLE IF EXISTS contact_submissions CASCADE;
DROP TABLE IF EXISTS gallery_photos CASCADE;
DROP TABLE IF EXISTS gallery_videos CASCADE;
DROP TABLE IF EXISTS player_stats CASCADE;
DROP TABLE IF EXISTS testimonials CASCADE;
DROP TABLE IF EXISTS career_highlights CASCADE;
DROP TABLE IF EXISTS career_highlight_details CASCADE;
DROP TABLE IF EXISTS education CASCADE;
DROP TABLE IF EXISTS honours CASCADE;
DROP TABLE IF EXISTS player_info CASCADE;
DROP TABLE IF EXISTS player_skills CASCADE;

-- Drop extensions if needed (optional, usually kept)
-- DROP EXTENSION IF EXISTS "uuid-ossp";
