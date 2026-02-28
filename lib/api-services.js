import supabaseAdmin from './supabase-admin.js';

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

        const timeAsTimestamp = typeof time === 'number' ? new Date(time * 1000).toISOString() : (typeof time === 'string' ? time : new Date().toISOString());

        const { data, error } = await supabaseAdmin
            .from('games')
            .insert([
                {
                    user_id: player,
                    player_name: playerName,
                    time: time ? timeAsTimestamp : new Date().toISOString(),
                    score: score,
                    ip_address: ipAddress,
                    device_type: deviceType,
                    user_agent: userAgent,
                    created_at: new Date().toISOString()
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
        console.log('getHighScore called with playerId:', playerId, 'type:', typeof playerId);
        const { data, error } = await supabaseAdmin
            .from('games')
            .select('*')
            .eq('user_id', playerId)
            .order('score', { ascending: false })
            .limit(1)
            .single();

        console.log('getHighScore result:', { data, error });

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
     * Get the global leaderboard using optimized database view.
     * Supports pagination for better performance with large datasets.
     */
    async getLeaderboard(limit = 10, offset = 0) {
        return this.getLeaderboardFromView(limit, offset);
    },

    /**
     * Get leaderboard data using the optimized database view.
     * This method uses the pre-calculated aggregations for better performance.
     */
    async getLeaderboardFromView(limit = 10, offset = 0) {
        const { data, error } = await supabaseAdmin
            .from('leaderboard_view')
            .select('*')
            .order('score', { ascending: false })
            .range(offset, offset + limit - 1);

        if (error) throw error;

        // Get total count for pagination
        const { count } = await supabaseAdmin
            .from('leaderboard_view')
            .select('*', { count: 'exact', head: true });

        return {
            leaderboard: data || [],
            pagination: {
                total: count || 0,
                page: Math.floor(offset / limit) + 1,
                limit,
                hasMore: (data?.length || 0) === limit,
                hasNext: (offset + limit) < (count || 0)
            }
        };
    },

    /**
     * Get full profile data for a user.
     */
    async getProfileData(userId) {
        console.log('GameService.getProfileData called with userId:', userId, 'type:', typeof userId);
        
        try {
            // Simple users table query
            const { data: userData, error: userError } = await supabaseAdmin
                .from('users')
                .select('*')
                .eq('user_id', userId)
                .single();

            if (userError && userError.code !== 'PGRST116') {
                console.error('Users table error:', userError);
                throw userError;
            }

            // If Guest user not found, create a placeholder record
            if (userId === '000000' && userError && userError.code === 'PGRST116') {
                console.log('Creating placeholder Guest user record');
                const { data: newGuest, error: insertError } = await supabaseAdmin
                    .from('users')
                    .insert({
                        user_id: '000000',
                        email: 'guest@example.com',
                        fullname: 'Guest Player',
                        profile_image_url: null,
                        created_at: new Date(),
                        last_sign_in_at: new Date()
                    })
                    .select()
                    .single();

                if (insertError) {
                    console.error('Failed to create Guest user record:', insertError);
                    throw insertError;
                }

                return {
                    user: newGuest,
                    highScore: 0,
                    pastGames: []
                };
            }

            // If we have user data, get games separately
            if (userData) {
                const highscoreData = await this.getHighScore(userId);
                const pastGames = await this.getPastTenGames(userId);

                const result = {
                    user: userData,
                    highScore: highscoreData ? highscoreData.score : 0,
                    pastGames: pastGames || []
                };

                return result;
            }

            return {
                user: userData,
                highScore: 0,
                pastGames: []
            };

        } catch (error) {
            console.error('getProfileData unexpected error:', error);
            throw error;
        }
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
