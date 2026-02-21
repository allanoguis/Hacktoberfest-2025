-- Database Cleanup Script
-- Removes all test data while preserving Guest user functionality
-- ===========================================

-- WARNING: This will delete ALL user and game data
-- Only run this if you want to completely reset the database

-- ===========================================
-- DELETE ALL GAMES (except Guest functionality will remain)
-- ===========================================

-- Remove all game entries
DELETE FROM games WHERE player_id != '000000';

-- ===========================================
-- DELETE ALL USERS (except Guest ID preservation)
-- ===========================================

-- Remove all authenticated users
DELETE FROM users WHERE user_id != '000000';

-- ===========================================
-- VERIFICATION - Confirm cleanup
-- ===========================================

-- Verify all games deleted (except potential Guest entries)
SELECT 
    COUNT(*) as remaining_games,
    COUNT(CASE WHEN player_id = '000000' THEN 1 END) as guest_games
FROM games;

-- Verify all users deleted (except Guest)
SELECT 
    COUNT(*) as remaining_users,
    COUNT(CASE WHEN user_id = '000000' THEN 1 END) as guest_user
FROM users;

-- Reset sequences for clean start
-- (Only if your database uses sequences)
-- ALTER SEQUENCE games_id_seq RESTART WITH 1;
-- ALTER SEQUENCE users_user_id_seq RESTART WITH 1;

-- ===========================================
-- SELECTIVE DATA REMOVAL
-- ===========================================

-- If you want to remove specific test data instead of everything:

-- Remove games for specific users
-- DELETE FROM games WHERE player_id IN ('user_001', 'user_002', 'user_003');

-- Remove specific users
-- DELETE FROM users WHERE user_id IN ('user_001', 'user_002', 'user_003');

-- Remove games older than specific date
-- DELETE FROM games WHERE created_at < NOW() - INTERVAL '7 days' AND player_id != '000000';

-- ===========================================
-- NOTES
-- ===========================================

-- Guest user (ID: 000000) is preserved for unauthenticated play
-- This cleanup maintains the Guest/Authenticated user separation
-- Always backup your database before running cleanup scripts
