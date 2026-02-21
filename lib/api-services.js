import supabase from './supabase';

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

        const { data, error } = await supabase
            .from('games')
            .insert([
                {
                    player_id: player,
                    player_name: playerName,
                    time: time,
                    score: score,
                    ip_address: ipAddress,
                    device_type: deviceType,
                    user_agent: userAgent,
                    created_at: new Date()
                }
            ])
            .select();

        if (error) throw error;
        return data[0];
    },

    /**
     * Get high score for a player.
     */
    async getHighScore(playerId) {
        const { data, error } = await supabase
            .from('games')
            .select('*')
            .eq('player_id', playerId)
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
        const { data, error } = await supabase
            .from('games')
            .select('*')
            .eq('player_id', playerId)
            .order('created_at', { ascending: false })
            .limit(10);

        if (error) throw error;
        return data;
    },

    /**
     * Get the global leaderboard from the Supabase `games` table (top 10 unique players by score).
     */
    async getLeaderboard() {
        const { data: games, error } = await supabase
            .from('games')
            .select(`
                player_id,
                player_name,
                score,
                time,
                users (
                    profile_image_url,
                    email
                )
            `)
            .order('score', { ascending: false })
            .limit(100);

        if (error) throw error;

        // Filter for unique players and stop when we have 10
        const topPlayers = [];
        const seenPlayers = new Set();

        for (const game of games) {
            if (topPlayers.length >= 10) break;

            const playerId = game.player_id;
            if (!seenPlayers.has(playerId)) {
                seenPlayers.add(playerId);
                topPlayers.push({
                    playerId: playerId,
                    playerName: game.player_name,
                    score: game.score,
                    time: game.time,
                    profileImageUrl: game.users?.profile_image_url,
                    email: game.users?.email
                });
            }
        }

        return topPlayers;
    },

    /**
     * Get full profile data for a user.
     */
    async getProfileData(userId) {
        // 1. Fetch User Info
        const { data: user, error: userError } = await supabase
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

        const { data, error } = await supabase
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
