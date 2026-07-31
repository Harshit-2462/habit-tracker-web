-- =======================================================
-- BATKITTY HABIT TRACKER - SEED DATA
-- Default Categories & Achievements
-- =======================================================

-- 1. Default Categories
INSERT INTO public.categories (id, user_id, name, color, icon, is_default)
VALUES
    ('c0000000-0000-0000-0000-000000000001', NULL, 'Vigilante Fitness', '#FF69B4', 'Dumbbell', TRUE),
    ('c0000000-0000-0000-0000-000000000002', NULL, 'Bat Cave Mindset', '#9B51E0', 'Brain', TRUE),
    ('c0000000-0000-0000-0000-000000000003', NULL, 'Kitty Nutrition', '#F4D03F', 'Apple', TRUE),
    ('c0000000-0000-0000-0000-000000000004', NULL, 'Gotham Productivity', '#FFB6C1', 'CheckCircle2', TRUE),
    ('c0000000-0000-0000-0000-000000000005', NULL, 'Dark Knight Rest', '#00E5FF', 'Moon', TRUE)
ON CONFLICT (id) DO NOTHING;

-- 2. Achievements
INSERT INTO public.achievements (code, title, description, badge_icon, xp_reward, coin_reward)
VALUES
    ('FIRST_HABIT', 'Bat Signal Lit', 'Created your very first habit!', 'Flame', 50, 20),
    ('STREAK_3', 'Kitty Paw Sprint', 'Maintained a 3-day completion streak!', 'Zap', 100, 30),
    ('STREAK_7', 'Gotham Guardian', 'Maintained a 7-day streak like a true hero!', 'ShieldCheck', 250, 50),
    ('STREAK_30', 'Dark Knight Legend', 'Completed 30 consecutive days of habits!', 'Crown', 1000, 200),
    ('TOTAL_50', 'Bat-Belt Master', 'Completed 50 habit logs in total!', 'Award', 500, 100),
    ('NIGHT_OWL', 'Midnight Meow', 'Completed a habit after 10:00 PM!', 'Moon', 75, 25),
    ('EARLY_BIRD', 'Dawn Patrol', 'Completed a habit before 7:00 AM!', 'Sun', 75, 25)
ON CONFLICT (code) DO NOTHING;
