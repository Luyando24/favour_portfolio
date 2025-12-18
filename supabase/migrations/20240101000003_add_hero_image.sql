-- Add hero_image_url to player_info table
ALTER TABLE player_info
ADD COLUMN IF NOT EXISTS hero_image_url text;

-- Optional: Update existing row with default if needed (though application code handles fallback)
-- UPDATE player_info SET hero_image_url = '/images/cover.jpeg' WHERE hero_image_url IS NULL;
