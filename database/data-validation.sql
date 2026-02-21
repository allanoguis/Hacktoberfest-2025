-- Data Validation Queries
-- Run these after population to verify data integrity

-- ===========================================
-- USER DATA VERIFICATION
-- ===========================================

-- Check total users (excluding Guest)
SELECT 
    COUNT(*) as total_users,
    COUNT(CASE WHEN user_id != '000000' THEN 1 END) as authenticated_users
FROM users;

-- Verify user distribution by skill level
SELECT 
    CASE 
        WHEN MAX(g.score) >= 45000 THEN 'Expert'
        WHEN MAX(g.score) >= 28000 THEN 'Advanced'
        WHEN MAX(g.score) >= 16000 THEN 'Intermediate'
        ELSE 'Beginner'
    END as skill_level,
    COUNT(*) as user_count,
    MAX(g.score) as highest_score,
    AVG(g.score) as average_score
FROM users u
JOIN games g ON u.user_id = g.player_id
WHERE u.user_id != '000000'
GROUP BY 
    CASE 
        WHEN MAX(g.score) >= 45000 THEN 'Expert'
        WHEN MAX(g.score) >= 28000 THEN 'Advanced'
        WHEN MAX(g.score) >= 16000 THEN 'Intermediate'
        ELSE 'Beginner'
    END;

-- ===========================================
-- GAME DATA VERIFICATION
-- ===========================================

-- Check total games (excluding Guest)
SELECT 
    COUNT(*) as total_games,
    COUNT(CASE WHEN player_id != '000000' THEN 1 END) as authenticated_games,
    COUNT(CASE WHEN player_id = '000000' THEN 1 END) as guest_games
FROM games;

-- Verify game distribution by score ranges
SELECT 
    CASE 
        WHEN score >= 45000 THEN 'Expert (45k+)'
        WHEN score >= 28000 THEN 'Advanced (28k-44k)'
        WHEN score >= 16000 THEN 'Intermediate (16k-27k)'
        ELSE 'Beginner (<16k)'
    END as score_range,
    COUNT(*) as game_count,
    AVG(score) as avg_score,
    MIN(score) as min_score,
    MAX(score) as max_score
FROM games
WHERE player_id != '000000'
GROUP BY 
    CASE 
        WHEN score >= 45000 THEN 'Expert (45k+)'
        WHEN score >= 28000 THEN 'Advanced (28k-44k)'
        WHEN score >= 16000 THEN 'Intermediate (16k-27k)'
        ELSE 'Beginner (<16k)'
    END
ORDER BY score_range DESC;

-- ===========================================
-- PERFORMANCE VERIFICATION
-- ===========================================

-- Check time performance distribution
SELECT 
    CASE 
        WHEN time <= 30 THEN 'Lightning Fast (<30s)'
        WHEN time <= 45 THEN 'Very Fast (30-45s)'
        WHEN time <= 60 THEN 'Fast (45-60s)'
        WHEN time <= 90 THEN 'Average (60-90s)'
        ELSE 'Slow (>90s)'
    END as time_category,
    COUNT(*) as game_count,
    AVG(time) as avg_time,
    MIN(time) as best_time,
    MAX(time) as worst_time
FROM games
WHERE player_id != '000000'
GROUP BY 
    CASE 
        WHEN time <= 30 THEN 'Lightning Fast (<30s)'
        WHEN time <= 45 THEN 'Very Fast (30-45s)'
        WHEN time <= 60 THEN 'Fast (45-60s)'
        WHEN time <= 90 THEN 'Average (60-90s)'
        ELSE 'Slow (>90s)'
    END
ORDER BY avg_time ASC;

-- ===========================================
-- DEVICE TYPE VERIFICATION
-- ===========================================

-- Check device distribution
SELECT 
    device_type,
    COUNT(*) as game_count,
    ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM games WHERE player_id != '000000'), 2) as percentage
FROM games
WHERE player_id != '000000'
GROUP BY device_type
ORDER BY game_count DESC;

-- ===========================================
-- LEADERBOARD VERIFICATION
-- ===========================================

-- Top 10 players (should match leaderboard display)
SELECT 
    g.player_id,
    u.fullname,
    u.email,
    MAX(g.score) as high_score,
    MIN(g.time) as best_time,
    COUNT(g.id) as games_played,
    u.profile_image_url
FROM games g
JOIN users u ON g.player_id = u.user_id
WHERE g.player_id != '000000'
GROUP BY g.player_id, u.fullname, u.email, u.profile_image_url
ORDER BY high_score DESC, best_time ASC
LIMIT 10;

-- Verify no Guest entries in top results
SELECT 'Guest entries in top 10: ' || 
       CASE WHEN COUNT(CASE WHEN player_id = '000000' THEN 1 END) > 0 THEN 'YES - PROBLEM' ELSE 'NO - GOOD' END
FROM (
    SELECT 
        g.player_id,
        u.fullname,
        MAX(g.score) as high_score,
        COUNT(g.id) as games_played
    FROM games g
    JOIN users u ON g.player_id = u.user_id
    WHERE g.player_id != '000000'
    GROUP BY g.player_id, u.fullname
    ORDER BY high_score DESC
    LIMIT 10
) top_players;

-- ===========================================
-- DATA INTEGRITY CHECKS
-- ===========================================

-- Check for orphaned games (games without users)
SELECT 'Orphaned games: ' || 
       CASE WHEN COUNT(*) > 0 THEN 'YES - PROBLEM' ELSE 'NO - GOOD' END
FROM games g
LEFT JOIN users u ON g.player_id = u.user_id
WHERE u.user_id IS NULL AND g.player_id != '000000';

-- Check for users without games
SELECT 
    u.user_id,
    u.fullname,
    u.email,
    'No games played' as status
FROM users u
LEFT JOIN games g ON u.user_id = g.player_id
WHERE g.id IS NULL AND u.user_id != '000000';

-- Verify email uniqueness
SELECT 'Duplicate emails: ' ||
       CASE WHEN COUNT(*) - COUNT(DISTINCT email) > 0 THEN 'YES - PROBLEM' ELSE 'NO - GOOD' END
FROM users
WHERE user_id != '000000';
