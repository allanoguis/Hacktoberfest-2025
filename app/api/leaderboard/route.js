import { NextResponse } from 'next/server';
import supabaseAdmin from '@/lib/supabase-admin';

export const dynamic = 'force-dynamic';

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        
        // Parse pagination parameters with defaults
        const page = Math.max(1, parseInt(searchParams.get('page')) || 1);
        const limit = Math.min(50, Math.max(1, parseInt(searchParams.get('limit')) || 10)); // Max 50 per page
        const offset = (page - 1) * limit;

        // Parse filter parameters
        const timeFilter = searchParams.get('timeFilter') || 'all'; // all, month, week
        const search = searchParams.get('search') || '';

        // Simple approach: Get all games and group by player to get max scores
        const { data: allGames, error: gamesError } = await supabaseAdmin
            .from('games')
            .select('*')
            .order('score', { ascending: false });

        if (gamesError) throw gamesError;

        // Group by player and get max score for each player
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

        // Convert to leaderboard format
        let leaderboard = Object.values(playerMaxScores).map(game => ({
            player_id: game.user_id,
            email: game.user?.email || 'guest@gojirun.local',
            player_name: game.player_name,
            profile_image_url: game.user?.profile_image_url || `https://api.dicebear.com/7.x/avataaars/png?seed=${game.player_name}&size=200`,
            score: game.score,
            best_time: playerBestTimes[game.player_name],
            games_played: playerGameCounts[game.player_name]
        }));

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
        });
    } catch (error) {
        console.error('Error in leaderboard route:', error);
        return NextResponse.json({ 
            success: false,
            message: 'Error retrieving leaderboard',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        }, { status: 500 });
    }
}
