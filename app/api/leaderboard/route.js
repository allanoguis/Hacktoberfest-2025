import { NextResponse } from 'next/server';
import supabaseAdmin from '@/lib/supabase-admin';

export const dynamic = 'force-dynamic';

export async function GET(request) {
    try {
        // Add cache-busting headers
        const headers = new Headers({
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0'
        });

        const { searchParams } = new URL(request.url);
        
        // Parse pagination parameters with defaults
        const page = Math.max(1, parseInt(searchParams.get('page')) || 1);
        const limit = Math.min(50, Math.max(1, parseInt(searchParams.get('limit')) || 10)); // Max 50 per page
        const offset = (page - 1) * limit;

        // Parse filter parameters
        const timeFilter = searchParams.get('timeFilter') || 'all'; // all, month, week
        const search = searchParams.get('search') || '';

        // Simple approach: Get all games and group by player to// Get all games for aggregation
        const { data: allGames, error: gamesError } = await supabaseAdmin
            .from('games')
            .select('*')
            .order('created_at', { ascending: false });

        if (gamesError) throw gamesError;

        // Aggregate data by player
        const playerMaxScores = {};
        const playerGameCounts = {};
        const playerBestTimes = {};

        allGames.forEach(game => {
            const playerName = game.player_name;
            
            // Track max score
            if (!playerMaxScores[playerName] || game.score > playerMaxScores[playerName].score) {
                playerMaxScores[playerName] = game;
            }
            
            // Count games
            playerGameCounts[playerName] = (playerGameCounts[playerName] || 0) + 1;
            
            // Track best time (lowest time)
            if (!playerBestTimes[playerName] || game.time < playerBestTimes[playerName]) {
                playerBestTimes[playerName] = game.time;
            }
        });

        // Get user profile data for all players
        const userIds = [...new Set(Object.values(playerMaxScores).map(game => game.user_id).filter(id => id && id !== '000000'))];
        
        let userProfiles = {};
        if (userIds.length > 0) {
            const { data: users, error: userError } = await supabaseAdmin
                .from('users')
                .select('user_id, email, profile_image_url')
                .in('user_id', userIds);
            
            if (!userError && users) {
                users.forEach(user => {
                    userProfiles[user.user_id] = user;
                });
            }
        }

        // Convert to leaderboard format
        let leaderboard = Object.values(playerMaxScores).map(game => {
            const userProfile = userProfiles[game.user_id];
            return {
                player_id: game.user_id,
                email: userProfile?.email || 'guest@gojirun.local',
                player_name: game.player_name,
                profile_image_url: userProfile?.profile_image_url || `https://api.dicebear.com/7.x/avataaars/png?seed=${game.player_name}&size=200`,
                score: game.score,
                best_time: playerBestTimes[game.player_name],
                games_played: playerGameCounts[game.player_name]
            };
        });

        // Sort by score in descending order (highest scores first)
        leaderboard.sort((a, b) => b.score - a.score);

        // Apply search filter
        if (search) {
            leaderboard = leaderboard.filter(player => 
                player.player_name?.toLowerCase().includes(search.toLowerCase()) ||
                player.email?.toLowerCase().includes(search.toLowerCase())
            );
        }

        // Apply pagination
        const paginatedLeaderboard = leaderboard.slice(offset, offset + limit);

        return NextResponse.json({
            success: true,
            data: {
                leaderboard: paginatedLeaderboard,
                pagination: {
                    total: leaderboard.length,
                    page,
                    limit,
                    hasMore: paginatedLeaderboard.length === limit,
                    hasNext: (offset + limit) < leaderboard.length
                },
                filters: {
                    timeFilter,
                    search,
                    applied: search || timeFilter !== 'all'
                }
            }
        }, { headers });
    } catch (error) {
        console.error('Error in leaderboard route:', error);
        return NextResponse.json({ 
            success: false,
            message: 'Error retrieving leaderboard',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        }, { status: 500 });
    }
}
