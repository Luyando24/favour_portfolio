
-- Seeding data for testimonials
DO $$
DECLARE
    v_testimonial_id uuid;
BEGIN
    -- Insert Testimonial if not exists
    IF NOT EXISTS (SELECT 1 FROM testimonials WHERE coach = 'Previous Coach') THEN
        INSERT INTO testimonials (text, coach, title, display_order)
        VALUES (
            'Favour is a motivated and creative footballer with a strong commitment to achieving team objectives. She has demonstrated performance excellence with a career-high 30 goals in the most recent season.',
            'Previous Coach',
            'Team Manager',
            1
        );
    END IF;
END $$;

-- Seeding data for career highlight details
DO $$
DECLARE
    v_highlight_id uuid;
BEGIN
    -- Get ID for ZUST FC highlight (assuming it exists from previous seeding)
    -- Matching by description as title is generic 'Striker'
    SELECT id INTO v_highlight_id FROM career_highlights WHERE description ILIKE '%ZUST FC%' LIMIT 1;
    
    IF v_highlight_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM career_highlight_details WHERE highlight_id = v_highlight_id) THEN
        INSERT INTO career_highlight_details (highlight_id, detail, display_order) VALUES
        (v_highlight_id, '2023 – 2024 Season', 1),
        (v_highlight_id, 'Key Striker', 2),
        (v_highlight_id, 'Achieved team objectives', 3);
    END IF;

    -- Get ID for Shanghai Celtic (formerly AFU FC) highlight
    SELECT id INTO v_highlight_id FROM career_highlights WHERE description ILIKE '%Shanghai Celtic%' LIMIT 1;
    
    IF v_highlight_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM career_highlight_details WHERE highlight_id = v_highlight_id) THEN
        INSERT INTO career_highlight_details (highlight_id, detail, display_order) VALUES
        (v_highlight_id, '2022 – 2023 Season', 1),
        (v_highlight_id, 'Demonstrated performance excellence', 2);
    END IF;

    -- Get ID for Shanxi (formerly Shanda FC) highlight
    SELECT id INTO v_highlight_id FROM career_highlights WHERE description ILIKE '%Shanxi%' LIMIT 1;
    
    IF v_highlight_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM career_highlight_details WHERE highlight_id = v_highlight_id) THEN
        INSERT INTO career_highlight_details (highlight_id, detail, display_order) VALUES
        (v_highlight_id, '2019 – 2021 Season', 1),
        (v_highlight_id, 'Developed key tactical skills', 2);
    END IF;
END $$;
