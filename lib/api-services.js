import supabaseAdmin from './supabase-admin';

/**
 * Service layer for Database operations.
 * Isolates Supabase logic from API route handlers for better security and testability.
 */

export const GameService = {
    /**
     * Save a game record.
     */
    async saveGame(params) {
        const { player, playerName, time, score, ipAddress, deviceType, userAgent } = params;

        const timeAsTimestamp = typeof time === 'number' ? new Date(time * 1000).toISOString() : time;

        const { data, error } = await supabaseAdmin
            .from('games')
            .insert([
                {
                    user_id: player,
                    player_name: playerName,
                    time: timeAsTimestamp,
                    score: score,
                    ip_address: ipAddress,
                    device_type: deviceType,
                    user_agent: userAgent,
                    created_at: new Date()
                }
            ])
            .select();

        if (error) throw error;

        const saved = data?.[0];
        if (!saved) {
            throw new Error('Failed to save game: no record returned');
        }

        return saved;
    },

    /**
     * Get high score for a player.
     */
    async getHighScore(playerId) {
        const { data, error } = await supabaseAdmin
            .from('games')
            .select('*')
            .eq('user_id', playerId)
            .order('score', { ascending: false })
            .limit(1)
            .single();

        if (error && error.code !== 'PGRST116') throw error;
        return data;
    },

    /**
     * Get past ten games for a player.
     */
    async getPastTenGames(playerId) {
        const { data, error } = await supabaseAdmin
            .from('games')
            .select('*')
            .eq('user_id', playerId)
            .order('created_at', { ascending: false })
            .limit(10);

        if (error) throw error;
        return data;
    },

    /**
     * Get the global leaderboard using the optimized database function.
     * Supports pagination for better performance with large datasets.
     */
    async getLeaderboard(limit = 10, offset = 0) {
        return this.getLeaderboardFallback(limit, offset);
    },

    /**
     * Fallback method using the original query structure.
     */
    async getLeaderboardFallback(limit = 10, offset = 0) {
        const fetchLimit = Math.min(5000, Math.max(100, (offset + limit) * 50));
        const { data: games, error } = await supabaseAdmin
            .from('games')
            .select(`
                user_id,
                player_name,
                score,
                time,
                users (
                    profile_image_url,
                    email
                )
            `)
            .order('score', { ascending: false })
            .range(0, fetchLimit - 1);

        if (error) throw error;

        // Compute best run per player (max score). This avoids relying on implicit ordering.
        const bestByPlayerId = new Map();

        for (const game of games || []) {
            const playerId = game.user_id;
            if (!playerId) continue;

            const score = typeof game.score === 'number' ? game.score : Number(game.score);
            const timeSeconds = typeof game.time === 'string' ? (new Date(game.time).getTime() / 1000) : Number(game.time);

            const existing = bestByPlayerId.get(playerId);
            if (!existing || score > existing.score || (score === existing.score && timeSeconds < existing.time)) {
                bestByPlayerId.set(playerId, {
                    playerId,
                    playerName: game.player_name,
                    score,
                    time: timeSeconds,
                    profileImageUrl: game.users?.profile_image_url || game.users?.profileImageUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${game.player_name || 'Guest'}`,
                    email: game.users?.email,
                    gamesPlayed: 1
                });
            }
        }

        const sortedPlayers = Array.from(bestByPlayerId.values()).sort((a, b) => {
            if (b.score !== a.score) return b.score - a.score;
            if (a.time !== b.time) return a.time - b.time;
            return String(a.playerId).localeCompare(String(b.playerId));
        });

        const pagePlayers = sortedPlayers.slice(offset, offset + limit);

        return {
            leaderboard: pagePlayers,
            pagination: {
                total: null, // Cannot determine without additional query
                page: Math.floor(offset / limit) + 1,
                limit,
                hasMore: false,
                hasNext: (sortedPlayers.length > (offset + limit))
            }
        };
    },

    /**
     * Get full profile data for a user.
     */
    async getProfileData(userId) {
        // 1. Fetch User Info
        const { data: user, error: userError } = await supabaseAdmin
            .from('users')
            .select('*')
            .eq('user_id', userId)
            .single();

        if (userError && userError.code !== 'PGRST116') throw userError;

        // 2. Fetch High Score
        const highscoreData = await this.getHighScore(userId);

        // 3. Fetch Past 10 Games
        const pastGames = await this.getPastTenGames(userId);

        return {
            user: user || null,
            highScore: highscoreData ? highscoreData.score : 0,
            pastGames: pastGames || []
        };
    },

    /**
     * Save or update a user profile.
     */
    async saveUser(params) {
        const { userId, email, fullname, profileImageUrl, createdAt, lastSignInAt } = params;

        const { data, error } = await supabaseAdmin
            .from('users')
            .upsert(
                [
                    {
                        user_id: userId,
                        email: email,
                        fullname: fullname,
                        profile_image_url: profileImageUrl,
                        created_at: createdAt,
                        last_sign_in_at: lastSignInAt
                    }
                ],
                { onConflict: 'user_id' }
            )
            .select();

        if (error) throw error;
        return { message: 'User synchronized successfully', user: data[0] };
    }
};
