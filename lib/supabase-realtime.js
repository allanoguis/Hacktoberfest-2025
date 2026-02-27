import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

let supabase = null;

// Only create Supabase client if environment variables are available
if (SUPABASE_URL && SUPABASE_ANON_KEY) {
  supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
} else {
  console.warn('Supabase environment variables not found. Real-time features will be disabled.');
}

export { supabase };

// Updated subscribeToLeaderboard function using Supabase's recommended approach
export async function subscribeToLeaderboard(onMessage) {
  // Return early if Supabase is not available
  if (!supabase) {
    console.warn('Supabase client not available. Real-time features disabled.');
    return null;
  }

  try {
    // Ensure we have an active session and set realtime auth for private channels
    const {
      data: { session },
      error: sessionError
    } = await supabase.auth.getSession();

    if (sessionError) {
      console.error('Error getting session before subscribing:', sessionError);
      return null;
    }
    if (!session?.access_token) {
      console.error('No access token: user not authenticated');
      return null;
    }

    await supabase.realtime.setAuth(session.access_token);

    const channel = supabase.channel('topic:leaderboard', {
      config: { 
        private: true, 
        broadcast: { self: false }, 
        presence: { key: session.user?.id ?? 'unknown' } 
      }
    });

    // Listen for the custom event emitted by the trigger
    channel.on('broadcast', { event: 'leaderboard_update' }, (payload) => {
      try {
        console.debug('Received leaderboard_update payload:', payload);
        // payload will be the JSON object created by the trigger:
        // { op: 'INSERT'|'UPDATE'|'DELETE', table: 'games', new: {...}|null, old: {...}|null }
        onMessage(payload);
      } catch (err) {
        console.error('Error handling leaderboard_update payload', err);
      }
    });

    // Optional: also listen for connection/state changes for debugging
    channel.on('postgres_changes', { event: '*', schema: 'public', table: 'games' }, (p) => {
      console.debug('postgres_changes (debug):', p);
    });

    const { error } = await channel.subscribe();
    if (error) {
      console.error('Failed to subscribe to leaderboard channel:', error);
      return null;
    }

    console.info('Subscribed to topic:leaderboard');

    // Return unsubscribe helper
    return () => {
      try {
        supabase.removeChannel(channel);
        console.info('Unsubscribed from topic:leaderboard');
      } catch (err) {
        console.error('Error unsubscribing channel:', err);
      }
    };
  } catch (error) {
    console.error('Error setting up leaderboard subscription:', error);
    return null;
  }
}
