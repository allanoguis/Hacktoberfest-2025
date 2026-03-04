-- Create RPC function to bypass triggers for game insertion
-- This function allows direct insertion without triggering realtime functions

CREATE OR REPLACE FUNCTION insert_game_bypass_triggers(
    p_user_id TEXT,
    p_player_name TEXT,
    p_score INTEGER,
    p_ip_address TEXT DEFAULT '127.0.0.1',
    p_device_type TEXT DEFAULT 'Unknown',
    p_user_agent TEXT DEFAULT 'Unknown'
)
RETURNS TABLE (
    id UUID,
    user_id TEXT,
    player_name TEXT,
    score INTEGER,
    ip_address TEXT,
    device_type TEXT,
    user_agent TEXT,
    created_at TIMESTAMPTZ
) AS $$
BEGIN
    -- Disable triggers temporarily
    SET session_replication_role = replica;
    
    -- Insert the game record
    RETURN QUERY
    INSERT INTO games (
        user_id,
        player_name,
        score,
        ip_address,
        device_type,
        user_agent,
        created_at
    ) VALUES (
        p_user_id,
        p_player_name,
        p_score,
        p_ip_address,
        p_device_type,
        p_user_agent,
        NOW()
    )
    RETURNING 
        id,
        user_id,
        player_name,
        score,
        ip_address,
        device_type,
        user_agent,
        created_at;
    
    -- Re-enable triggers
    SET session_replication_role = DEFAULT;
    
    EXCEPTION
        WHEN OTHERS THEN
            -- Ensure triggers are re-enabled even on error
            SET session_replication_role = DEFAULT;
            RAISE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add comment for documentation
COMMENT ON FUNCTION insert_game_bypass_triggers IS 'Bypasses triggers to insert game records directly, used as fallback when realtime functions fail';
