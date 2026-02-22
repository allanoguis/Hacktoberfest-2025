-- Supabase Data Population Script
-- Populates users and games tables with realistic test data
-- Excludes Guest user (ID: 000000) from population

-- ===========================================
-- USERS TABLE POPULATION
-- ===========================================

-- Insert authenticated users (excluding Guest ID 000000)
INSERT INTO users (user_id, email, fullname, profile_image_url, created_at, last_sign_in_at) VALUES
-- Expert Players
('user_001', 'pro.gamer.one@example.com', 'Pro Gamer One', 'https://api.dicebear.com/7.x/avataaars/svg?seed=ProGamer1', NOW() - INTERVAL '30 days', NOW() - INTERVAL '1 day'),
('user_002', 'speed.demon.two@example.com', 'Speed Demon Two', 'https://api.dicebear.com/7.x/avataaars/svg?seed=SpeedDemon2', NOW() - INTERVAL '25 days', NOW() - INTERVAL '2 days'),
('user_003', 'high.scorer.three@example.com', 'High Scorer Three', 'https://api.dicebear.com/7.x/avataaars/svg?seed=HighScorer3', NOW() - INTERVAL '20 days', NOW() - INTERVAL '3 hours'),

-- Advanced Players
('user_004', 'advanced.player.four@example.com', 'Advanced Player Four', 'https://api.dicebear.com/7.x/avataaars/svg?seed=AdvancedPlayer4', NOW() - INTERVAL '45 days', NOW() - INTERVAL '12 hours'),
('user_005', 'strategic.master.five@example.com', 'Strategic Master Five', 'https://api.dicebear.com/7.x/avataaars/svg?seed=StrategicMaster5', NOW() - INTERVAL '60 days', NOW() - INTERVAL '6 hours'),

-- Intermediate Players
('user_006', 'rising.star.six@example.com', 'Rising Star Six', 'https://api.dicebear.com/7.x/avataaars/svg?seed=RisingStar6', NOW() - INTERVAL '15 days', NOW() - INTERVAL '8 hours'),
('user_007', 'consistent.player.seven@example.com', 'Consistent Player Seven', 'https://api.dicebear.com/7.x/avataaars/svg?seed=ConsistentPlayer7', NOW() - INTERVAL '18 days', NOW() - INTERVAL '4 hours'),
('user_008', 'improving.eight@example.com', 'Improving Eight', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Improving8', NOW() - INTERVAL '10 days', NOW() - INTERVAL '2 days'),

-- Beginner Players
('user_009', 'casual.nine@example.com', 'Casual Player Nine', 'https://api.dicebear.com/7.x/avataaars/svg?seed=CasualPlayer9', NOW() - INTERVAL '7 days', NOW() - INTERVAL '1 hour'),
('user_010', 'newcomer.ten@example.com', 'Newcomer Ten', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Newcomer10', NOW() - INTERVAL '3 days', NOW() - INTERVAL '12 hours'),

-- ===========================================
-- GAMES TABLE POPULATION
-- ===========================================

-- Games for Pro Gamer One (Expert Level)
INSERT INTO games (user_id, player_name, score, time, ip_address, device_type, user_agent, created_at) VALUES
('user_001', 'Pro Gamer One', 45000, to_timestamp(25.3), '192.168.1.100', 'desktop', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36', NOW() - INTERVAL '1 day'),
('user_001', 'Pro Gamer One', 42000, to_timestamp(28.7), '192.168.1.100', 'desktop', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36', NOW() - INTERVAL '2 days'),
('user_001', 'Pro Gamer One', 48500, to_timestamp(31.2), '192.168.1.100', 'desktop', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36', NOW() - INTERVAL '3 days'),

-- Games for Speed Demon Two (Expert Level)
INSERT INTO games (user_id, player_name, score, time, ip_address, device_type, user_agent, created_at) VALUES
('user_002', 'Speed Demon Two', 38000, to_timestamp(22.8), '192.168.1.101', 'desktop', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36', NOW() - INTERVAL '2 days'),
('user_002', 'Speed Demon Two', 41000, to_timestamp(19.5), '192.168.1.101', 'desktop', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36', NOW() - INTERVAL '1 day'),

-- Games for High Scorer Three (Expert Level)
INSERT INTO games (user_id, player_name, score, time, ip_address, device_type, user_agent, created_at) VALUES
('user_003', 'High Scorer Three', 52000, to_timestamp(35.6), '192.168.1.102', 'desktop', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36', NOW() - INTERVAL '20 days'),
('user_003', 'High Scorer Three', 47500, to_timestamp(42.1), '192.168.1.102', 'desktop', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36', NOW() - INTERVAL '15 days'),
('user_003', 'High Scorer Three', 55000, to_timestamp(28.9), '192.168.1.102', 'desktop', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36', NOW() - INTERVAL '10 days'),

-- Games for Advanced Player Four (Advanced Level)
INSERT INTO games (user_id, player_name, score, time, ip_address, device_type, user_agent, created_at) VALUES
('user_004', 'Advanced Player Four', 28000, to_timestamp(58.3), '192.168.1.103', 'desktop', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36', NOW() - INTERVAL '45 days'),
('user_004', 'Advanced Player Four', 31000, to_timestamp(52.7), '192.168.1.103', 'desktop', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36', NOW() - INTERVAL '30 days'),

-- Games for Strategic Master Five (Expert Level)
INSERT INTO games (user_id, player_name, score, time, ip_address, device_type, user_agent, created_at) VALUES
('user_005', 'Strategic Master Five', 49000, to_timestamp(45.1), '192.168.1.104', 'desktop', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:91.0) Gecko/20100101 Firefox/91.0', NOW() - INTERVAL '60 days'),
('user_005', 'Strategic Master Five', 51500, to_timestamp(38.9), '192.168.1.104', 'desktop', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:91.0) Gecko/20100101 Firefox/91.0', NOW() - INTERVAL '25 days'),

-- Games for Rising Star Six (Intermediate Level)
INSERT INTO games (user_id, player_name, score, time, ip_address, device_type, user_agent, created_at) VALUES
('user_006', 'Rising Star Six', 18000, to_timestamp(68.4), '192.168.1.105', 'mobile', 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_7_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.0 Mobile/15E148 Safari/604.1', NOW() - INTERVAL '15 days'),
('user_006', 'Rising Star Six', 19500, to_timestamp(71.2), '192.168.1.105', 'mobile', 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_7_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.0 Mobile/15E148 Safari/604.1', NOW() - INTERVAL '8 days'),
('user_006', 'Rising Star Six', 21000, to_timestamp(62.1), '192.168.1.105', 'mobile', 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_7_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.0 Mobile/15E148 Safari/604.1', NOW() - INTERVAL '6 days'),

-- Games for Consistent Player Seven (Intermediate Level)
INSERT INTO games (user_id, player_name, score, time, ip_address, device_type, user_agent, created_at) VALUES
('user_007', 'Consistent Player Seven', 16000, to_timestamp(75.8), '192.168.1.106', 'desktop', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36', NOW() - INTERVAL '18 days'),
('user_007', 'Consistent Player Seven', 17500, to_timestamp(69.3), '192.168.1.106', 'desktop', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36', NOW() - INTERVAL '4 days'),

-- Games for Improving Eight (Intermediate to Advanced)
INSERT INTO games (user_id, player_name, score, time, ip_address, device_type, user_agent, created_at) VALUES
('user_008', 'Improving Eight', 14000, to_timestamp(82.5), '192.168.1.107', 'desktop', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36', NOW() - INTERVAL '10 days'),
('user_008', 'Improving Eight', 15500, to_timestamp(78.1), '192.168.1.107', 'desktop', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36', NOW() - INTERVAL '5 days'),
('user_008', 'Improving Eight', 16800, to_timestamp(74.2), '192.168.1.107', 'desktop', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36', NOW() - INTERVAL '2 days'),

-- Games for Casual Player Nine (Beginner Level)
INSERT INTO games (user_id, player_name, score, time, ip_address, device_type, user_agent, created_at) VALUES
('user_009', 'Casual Player Nine', 3500, to_timestamp(95.7), '192.168.1.108', 'mobile', 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.0 Mobile/15E148 Safari/604.1', NOW() - INTERVAL '7 days'),
('user_009', 'Casual Player Nine', 4200, to_timestamp(88.3), '192.168.1.108', 'mobile', 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.0 Mobile/15E148 Safari/604.1', NOW() - INTERVAL '3 days'),

-- Games for Newcomer Ten (Beginner Level)
INSERT INTO games (user_id, player_name, score, time, ip_address, device_type, user_agent, created_at) VALUES
('user_010', 'Newcomer Ten', 2800, to_timestamp(120.5), '192.168.1.109', 'tablet', 'Mozilla/5.0 (iPad; CPU OS 15_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.0 Mobile/15E148 Safari/604.1', NOW() - INTERVAL '3 days'),
('user_010', 'Newcomer Ten', 3500, to_timestamp(105.8), '192.168.1.109', 'tablet', 'Mozilla/5.0 (iPad; CPU OS 15_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.0 Mobile/15E148 Safari/604.1', NOW() - INTERVAL '1 day');

-- ===========================================
-- VERIFICATION QUERIES
-- ===========================================

-- Verify data was inserted correctly
SELECT 
    u.user_id,
    u.fullname,
    u.email,
    COUNT(g.id) as games_played,
    MAX(g.score) as high_score,
    MIN(g.time) as best_time,
    AVG(g.score) as average_score
FROM users u 
LEFT JOIN games g ON u.user_id = g.user_id 
WHERE u.user_id != '000000'
GROUP BY u.user_id, u.fullname, u.email
ORDER BY high_score DESC, best_time ASC;

-- Check that no Guest entries exist in populated data
SELECT COUNT(*) as guest_entries 
FROM games 
WHERE user_id = '000000';

-- Expected: 0 guest entries
