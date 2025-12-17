-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. Contact Submissions Table
create table if not exists contact_submissions (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  email text not null,
  phone text,
  message text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  read boolean default false
);

-- 2. Gallery Photos Table
create table if not exists gallery_photos (
  id uuid default uuid_generate_v4() primary key,
  url text not null,
  caption text,
  category text default 'all', -- 'action', 'training', 'match', 'lifestyle', 'youth'
  display_order integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Gallery Videos Table
create table if not exists gallery_videos (
  id uuid default uuid_generate_v4() primary key,
  url text not null,
  thumbnail_url text,
  title text,
  category text default 'all', -- 'highlights', 'goals', 'training', 'drills', 'tactical'
  display_order integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. Player Stats Table (for Numerical Stats)
create table if not exists player_stats (
  id uuid default uuid_generate_v4() primary key,
  label text not null,
  value text not null,
  category text not null, -- 'performance', 'measurement'
  display_order integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 5. Testimonials Table
create table if not exists testimonials (
  id uuid default uuid_generate_v4() primary key,
  text text not null,
  coach text not null,
  title text,
  display_order integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 6. Career Highlights Table (Work Experience)
create table if not exists career_highlights (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  description text not null,
  year text not null,
  icon text, -- Emoji or icon name
  display_order integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 7. Career Highlight Details (One-to-many relationship)
create table if not exists career_highlight_details (
  id uuid default uuid_generate_v4() primary key,
  highlight_id uuid references career_highlights(id) on delete cascade not null,
  detail text not null,
  display_order integer default 0
);

-- 8. Education Table
create table if not exists education (
  id uuid default uuid_generate_v4() primary key,
  degree text not null,
  institution text not null,
  year text not null,
  details text,
  website text,
  display_order integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 9. Honours Table
create table if not exists honours (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  display_order integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 10. Player Profile Info (Single Row Config)
create table if not exists player_info (
  id uuid default uuid_generate_v4() primary key,
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
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 11. Player Skills Table
create table if not exists player_skills (
  id uuid default uuid_generate_v4() primary key,
  category text not null, -- 'technical', 'tactical', 'physical'
  skill text not null,
  display_order integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS Policies (Simplified for Demo)
alter table contact_submissions enable row level security;
create policy "Enable insert for everyone" on contact_submissions for insert with check (true);
create policy "Enable select for everyone" on contact_submissions for select using (true);
create policy "Enable delete for everyone" on contact_submissions for delete using (true);
create policy "Enable update for everyone" on contact_submissions for update using (true);

alter table gallery_photos enable row level security;
create policy "Enable all access" on gallery_photos for all using (true);

alter table gallery_videos enable row level security;
create policy "Enable all access" on gallery_videos for all using (true);

alter table player_stats enable row level security;
create policy "Enable all access" on player_stats for all using (true);

alter table testimonials enable row level security;
create policy "Enable all access" on testimonials for all using (true);

alter table career_highlights enable row level security;
create policy "Enable all access" on career_highlights for all using (true);

alter table career_highlight_details enable row level security;
create policy "Enable all access" on career_highlight_details for all using (true);

alter table education enable row level security;
create policy "Enable all access" on education for all using (true);

alter table honours enable row level security;
create policy "Enable all access" on honours for all using (true);

alter table player_info enable row level security;
create policy "Enable all access" on player_info for all using (true);

alter table player_skills enable row level security;
create policy "Enable all access" on player_skills for all using (true);

-- Insert Initial Data (Seeding)

-- Player Info
insert into player_info (full_name, age, dob, place_of_birth, height, weight, nationality, languages, position, footedness, location, tagline, email, phone, whatsapp, instagram, youtube) values
('Favour Chinelo Anekwe', '21', '07/07/2004', 'Anambra, Nigeria', '166cm', '64kg', ARRAY['Nigerian'], ARRAY['English', 'Chinese'], 'Forward (Striker)', 'Right Foot', '135 Liuhe Road, West Lake District., 242332 Hangzho (China)', 'Motivated, physically fit, and creative footballer with a strong commitment to achieving team objectives, securing titles, and contributing to the club’s legacy. Dedicated to intensive training programs and performance excellence, demonstrated by a career-high 30 goals scored in the most recent season.', 'gentlegentlemoon@gmail.com', '(+86) 18536223834', '(+86) 18536223834', 'https://www.instagram.com/Favour_gentle11', '');

-- Player Stats (Numerical)
insert into player_stats (label, value, category, display_order) values
('Goals Scored', '80', 'performance', 1),
('Total Shots', '120', 'performance', 2),
('Assists', '35', 'performance', 3),
('Pass Completion', '84.5%', 'performance', 4),
('Career High Goals (Season)', '30', 'performance', 5);

-- Player Skills
insert into player_skills (category, skill, display_order) values
('technical', 'Dribbling', 1),
('technical', 'Ball Control', 2),
('technical', '1v1 Defending', 3),
('technical', 'Passing Accuracy', 4),
('tactical', 'Positioning', 1),
('tactical', 'Game Awareness', 2),
('physical', 'Agility', 1),
('physical', 'Physical Strength', 2),
('physical', 'Speed', 3),
('physical', 'Endurance', 4);

-- Career Highlights (Work Experience)
insert into career_highlights (title, description, year, icon, display_order) values
('Striker', 'Zhejiang University of Science and Technology Women Team (ZUST FC) – HANGZHOU, China', '2023 – 2024', '🏆', 1),
('Striker', 'Shanghai Celtic fc – China', '2022 – 2023', '⚽', 2),
('Forward (Striker)', 'Shanxi university (Shanxi FC) – China', '2019 – 2021', '🥅', 3);

-- Education
insert into education (degree, institution, year, details, website, display_order) values
('Master''s Degree', 'ZHEJIANG UNIVERSITY OF SCIENCE AND TECHNOLOGY', '2025', 'City: HANGZHOU | Country: China | Level in EQF: EQF level 7', 'www.zust.edu.cn/', 1),
('Bachelor''s Degree', 'SHANXI UNIVERSITY', '2022', 'City: TAIYUAN CITY | Country: China | Level in EQF: EQF level 6', 'www.sxu.edu.cn', 2),
('Higher National Diploma', 'EL-ROI LONDON UNIVERSITY', '2023', 'City: LONDON | Country: United Kingdom | Level in EQF: EQF level 5', 'https://elroilondonuniversity.org', 3);

-- Honours
insert into honours (title, display_order) values
('Shanxi League best striker of the year', 1),
('Golden Boot (3x)', 2),
('Nu women League(Shanghai) Golden Boot of the year', 3),
('Mojito cup Golden boot and champion', 4);

-- Gallery Photos
insert into gallery_photos (url, caption, category, display_order) values
('/gallery/photos/4a0440f2-dfe0-4ac7-9de6-3e7f3ffb4429.JPG', 'Match Action', 'action', 1),
('/gallery/photos/4a0440f2-dfe0-4ac7-9de6-3e7f3ffb44295.JPG', 'Performance', 'action', 2),
('/gallery/photos/535709ca-08da-48a5-8de4-c503581dcbe6.JPG', 'On Field', 'action', 3),
('/gallery/photos/9b0edd69-a52b-413d-9109-f8d63f273850.JPG', 'Training', 'training', 4),
('/gallery/photos/IMG_7466.jpg', 'Portrait', 'lifestyle', 5),
('/gallery/photos/Photo .jpg', 'Profile', 'lifestyle', 6),
('/gallery/photos/WhatsApp Image 2025-11-23 at 03.04.34.jpeg', 'Team', 'benfica', 7),
('/gallery/photos/WhatsApp Image 2025-11-23 at 03.04.343.jpeg', 'Match Day', 'benfica', 8),
('/gallery/photos/WhatsApp Image 2025-11-23 at 03.04.3433.jpeg', 'Practice', 'training', 9),
('/gallery/photos/WhatsApp Image 2025-11-23 at 09.43.58.jpeg', 'Casual', 'lifestyle', 10),
('/gallery/photos/WhatsApp Image 2025-11-23 at 09.43.582.jpeg', 'Game Time', 'action', 11),
('/gallery/photos/WhatsApp Image 2025-11-23 at 09.45.01.jpeg', 'Drills', 'training', 12),
('/gallery/photos/c4944268-4b1d-4f77-b54d-76a36a24ddfd.JPG', 'Moment', 'lifestyle', 13);

-- Gallery Videos
insert into gallery_videos (url, thumbnail_url, title, category, display_order) values
-- Goals
('/Goals/WhatsApp Video 2025-11-26 at 02.47.11_a706a82f.mp4', '/gallery/photos/4a0440f2-dfe0-4ac7-9de6-3e7f3ffb4429.JPG', 'Dribbling to score a goal', 'goals', 1),
('/Goals/WhatsApp Video 2025-11-26 at 02.47.11_967365b5.mp4', '/gallery/photos/4a0440f2-dfe0-4ac7-9de6-3e7f3ffb44295.JPG', 'Long pass, reading the game', 'goals', 2),
('/Goals/WhatsApp Video 2025-11-26 at 02.47.11_54bb6254.mp4', '/gallery/photos/535709ca-08da-48a5-8de4-c503581dcbe6.JPG', 'Great positioning, Goal scoring', 'goals', 3),
('/Goals/WhatsApp Video 2025-11-26 at 02.47.11_3abeb785.mp4', '/gallery/photos/9b0edd69-a52b-413d-9109-f8d63f273850.JPG', 'Controlling skills & shooting from distance', 'goals', 4),
('/Goals/WhatsApp Video 2025-11-26 at 02.47.11_14e84caf.mp4', '/gallery/photos/IMG_7466.jpg', 'Dribbling.. Goal scoring', 'goals', 5),
('/Goals/WhatsApp Video 2025-11-26 at 02.47.11_00d2dae6.mp4', '/gallery/photos/WhatsApp Image 2025-11-23 at 03.04.34.jpeg', 'Stealing the ball.. Goal scorer', 'goals', 6),
('/Goals/WhatsApp Video 2025-11-26 at 02.47.11_b0994e72.mp4', '/gallery/photos/WhatsApp Image 2025-11-23 at 03.04.343.jpeg', 'Shooting under pressure, from outside the box', 'goals', 7),
('/Goals/WhatsApp Video 2025-11-26 at 02.47.10_a6879f7c.mp4', '/gallery/photos/WhatsApp Image 2025-11-23 at 03.04.3433.jpeg', 'Team work , Goal scoring', 'goals', 8),
('/Goals/WhatsApp Video 2025-11-26 at 02.47.12_6135b5db.mp4', '/gallery/photos/WhatsApp Image 2025-11-23 at 09.43.58.jpeg', 'Header Goal scoring', 'goals', 9),
('/Goals/WhatsApp Video 2025-11-26 at 02.47.12_72227916.mp4', '/gallery/photos/WhatsApp Image 2025-11-23 at 09.43.582.jpeg', 'Tactical skills', 'goals', 10),
-- Highlights
('/gallery/videos/WhatsApp Video 2025-11-21 at 16.50.09_65a9caec.mp4', '/gallery/photos/WhatsApp Image 2025-11-23 at 09.45.01.jpeg', 'Skills 1', 'highlights', 11),
('/gallery/videos/WhatsApp Video 2025-11-21 at 16.50.11_8c3a9d97.mp4', '/gallery/photos/c4944268-4b1d-4f77-b54d-76a36a24ddfd.JPG', 'Striker by Nature', 'highlights', 12),
('/gallery/videos/WhatsApp Video 2025-11-21 at 16.50.11_f64a38cd.mp4', '/gallery/photos/4a0440f2-dfe0-4ac7-9de6-3e7f3ffb4429.JPG', 'Long distance shooting, goal scorer', 'highlights', 13),
('/gallery/videos/WhatsApp Video 2025-11-21 at 16.50.12_21948e55.mp4', '/gallery/photos/4a0440f2-dfe0-4ac7-9de6-3e7f3ffb44295.JPG', 'Post Game interview', 'highlights', 14),
-- Training
('/gallery/videos/WhatsApp Video 2025-11-21 at 16.50.09_067e16c7.mp4', '/gallery/photos/535709ca-08da-48a5-8de4-c503581dcbe6.JPG', 'Opportunity hunter, Goal Scorer', 'training', 15),
('/gallery/videos/WhatsApp Video 2025-11-21 at 16.50.09_59f498b8.mp4', '/gallery/photos/9b0edd69-a52b-413d-9109-f8d63f273850.JPG', 'Game reader , Dribbler , Shooter , Goal Scorer', 'training', 16),
('/gallery/videos/WhatsApp Video 2025-11-21 at 16.50.10_c68d2717.mp4', '/gallery/photos/IMG_7466.jpg', 'Long distance shooting, goal scorer', 'training', 17),
('/gallery/videos/WhatsApp Video 2025-11-21 at 16.50.11_2a9969ac.mp4', '/gallery/photos/WhatsApp Image 2025-11-23 at 03.04.34.jpeg', 'Training Footage 4', 'training', 18),
-- Drills
('/gallery/videos/WhatsApp Video 2025-11-21 at 16.49.24_3fdcfb76.mp4', '/gallery/photos/WhatsApp Image 2025-11-23 at 03.04.343.jpeg', 'Skills 2', 'drills', 19),
('/gallery/videos/WhatsApp Video 2025-11-21 at 16.50.09_fff2b2b2.mp4', '/gallery/photos/WhatsApp Image 2025-11-23 at 03.04.3433.jpeg', 'Long distance shooting, goal scorer', 'drills', 20),
('/gallery/videos/WhatsApp Video 2025-11-21 at 16.50.10_04148641.mp4', '/gallery/photos/WhatsApp Image 2025-11-23 at 09.43.58.jpeg', 'Long distance shooting, goal scorer', 'drills', 21),
('/gallery/videos/WhatsApp Video 2025-11-21 at 16.50.10_d8ec8309.mp4', '/gallery/photos/WhatsApp Image 2025-11-23 at 09.43.582.jpeg', 'Skills Video 4', 'drills', 22),
('/gallery/videos/WhatsApp Video 2025-11-21 at 16.50.11_cf63a05c.mp4', '/gallery/photos/WhatsApp Image 2025-11-23 at 09.45.01.jpeg', 'Long distance shooting, goal scorer', 'drills', 23),
-- Tactical
('/gallery/videos/WhatsApp Video 2025-11-21 at 16.50.11_03dc67ba.mp4', '/gallery/photos/c4944268-4b1d-4f77-b54d-76a36a24ddfd.JPG', 'Long distance shooting, goal scorer', 'tactical', 24),
('/gallery/videos/WhatsApp Video 2025-11-21 at 16.50.12_761def97.mp4', '/gallery/photos/4a0440f2-dfe0-4ac7-9de6-3e7f3ffb4429.JPG', 'Long distance shooting, goal scorer', 'tactical', 25);
