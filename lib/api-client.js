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
 * Fetch the leaderboard.
 */
export const getLeaderboard = async () => {
    try {
        const response = await fetch('/api/leaderboard');
        if (!response.ok) throw new Error('Failed to fetch leaderboard');
        return await response.json();
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
