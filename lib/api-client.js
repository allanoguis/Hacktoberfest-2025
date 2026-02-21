/**
 * Client-side API fetchers for Gojirun.
 * All functions are asynchronous and return JSON data.
 */

/**
 * Save game results to the database.
 * @param {Object} data - Game stats (score, player, etc.)
 */
export const saveGame = async (data) => {
    try {
        const response = await fetch('/api/savegame', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || `API error: ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Error while calling saveGame API:", error);
        throw error;
    }
};

/**
 * Fetch the high score for a specific player.
 * @param {Object} data - { playerId }
 */
export const fetchHighScore = async (data) => {
    try {
        const params = new URLSearchParams(data).toString();
        const response = await fetch(`/api/highscore?${params}`);
        if (!response.ok) throw new Error('Failed to fetch high score');
        return await response.json();
    } catch (error) {
        console.error("Error while calling highscore API:", error);
        throw error;
    }
};

/**
 * Fetch the last ten games for a specific player.
 * @param {Object} data - { playerId }
 */
export const getPastTen = async (data) => {
    try {
        const params = new URLSearchParams(data).toString();
        const response = await fetch(`/api/getpastten?${params}`);
        if (!response.ok) throw new Error('Failed to fetch past ten games');
        return await response.json();
    } catch (error) {
        console.error("Error while calling getPastTen API:", error);
        throw error;
    }
};

/**
 * Fetch the leaderboard with pagination and filtering support.
 * For the same list on localhost and production, use the same SUPABASE_URL (and key) in both, or set NEXT_PUBLIC_LEADERBOARD_API_URL to the production API URL (e.g. https://your-app.com/api/leaderboard).
 * @param {Object} params - Pagination and filter parameters
 * @param {number} params.page - Page number (default: 1)
 * @param {number} params.limit - Items per page (default: 10, max: 50)
 * @param {string} params.timeFilter - Time filter: 'all', 'month', 'week' (default: 'all')
 * @param {string} params.search - Search term for player names/emails (default: '')
 */
const leaderboardUrl =
  (typeof process !== "undefined" && process.env?.NEXT_PUBLIC_LEADERBOARD_API_URL?.trim()) ||
  "/api/leaderboard";

export const getLeaderboard = async (params = {}) => {
    try {
        const {
            page = 1,
            limit = 10,
            timeFilter = 'all',
            search = ''
        } = params;

        // Build query string
        const queryParams = new URLSearchParams({
            page: page.toString(),
            limit: limit.toString(),
            ...(timeFilter !== 'all' && { timeFilter }),
            ...(search && { search })
        });

        const url = `${leaderboardUrl}?${queryParams.toString()}`;
        
        const response = await fetch(url, { 
            cache: 'no-store',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || `API error: ${response.statusText}`);
        }
        
        const result = await response.json();
        
        // Handle the new response structure
        if (result.success) {
            return result.data;
        } else {
            throw new Error(result.message || 'Failed to fetch leaderboard');
        }
    } catch (error) {
        console.error("Error while calling leaderboard API:", error);
        throw error;
    }
};

/**
 * Save user profile info.
 */
export const saveUser = async (data) => {
    try {
        const response = await fetch('/api/users', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        return await response.json();
    } catch (error) {
        console.error("Error while calling saveUser API:", error);
        throw error;
    }
};
